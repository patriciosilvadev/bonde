import React from "react";
import { gql, useQuery } from "bonde-core-tools";
import { CheckCommunity } from "../../components";
import { useFilterState } from "../../services/FilterProvider";
import { addDistance } from "../../services/utils";

import {
  getVolunteerOrganizationId,
  zendeskOrganizations,
  stripIndividualFromData,
} from "../../services/utils";
// import { MapaIndividual } from "../../types";

import styled from "styled-components";
import { Loading } from "bonde-components";
import {
  MAPA_INDIVIDUAL,
  MAPA_TICKET_INDIVIDUAL,
} from "../../graphql/IndividualFragment.graphql";

const WrapLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const VOLUNTEERS_FOR_MATCH = gql`
  query VolunteersForMatch(
    $volunteerOrganizationId: bigint_comparison_exp!
    $lastMonth: timestamp_comparison_exp!
  ) {
    volunteers: solidarity_users(
      where: {
        condition: { _eq: "disponivel" }
        name: { _is_null: false }
        registration_number: { _is_null: false }
        atendimentos_em_andamento_calculado_: { _eq: 0 }
        state: { _neq: "int" }
        city: { _neq: "Internacional" }
        _or: [{ phone: { _is_null: false } }, { whatsapp: { _is_null: false } }]
        _and: [
          { organization_id: $volunteerOrganizationId }
          { organization_id: { _is_null: false } }
          { longitude: { _is_null: false } }
          { longitude: { _neq: "ZERO_RESULTS" } }
          { latitude: { _is_null: false } }
          { latitude: { _neq: "ZERO_RESULTS" } }
        ]
      }
    ) {
      ...individual
    }
    pendingTickets: solidarity_matches(
      order_by: { created_at: desc }
      where: {
        created_at: $lastMonth
        status: { _eq: "encaminhamento__realizado" }
      }
    ) {
      volunteersUserId: volunteers_user_id
      volunteersTicketId: volunteers_ticket_id
      id
    }
  }
  ${MAPA_INDIVIDUAL}
`;

const RECIPIENTS_FOR_MATCH = gql`
  query RecipientsForMatch(
    $recipientOrganizationId: bigint_comparison_exp!
  ) {
    recipients: solidarity_tickets(
      where: {
        status: { _nin: ["deleted", "solved"] }
        status_acolhimento: {
          _in: [
            "solicitação_recebida"
            "encaminhamento__realizado_para_serviço_público"
          ]
        }
        individual: {
          organization_id: $recipientOrganizationId
          condition: { _eq: "inscrita" }
          latitude: { _is_null: false }
          longitude: { _is_null: false }
          email: { _is_null: false }
          name: { _is_null: false }
        }
        _and: [
          { individual: { latitude: {_is_null: false} } }
          { individual: { longitude: {_is_null: false} } }
          { individual: { latitude: {_neq: "ZERO_RESULTS"} } }
          { individual: { longitude: {_neq: "ZERO_RESULTS"} } }
        ]
      }
      order_by: { individual: { data_de_inscricao_no_bonde: asc } }
    ) {
      ...ticketIndividual
    }
  }
  ${MAPA_TICKET_INDIVIDUAL}
`;

type Props = {
  organizationId: number;
  subject: string;
  children: any;
  monthlyTimestamp: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
};

export type MatchTickets = {
  volunteersUserId: number;
  volunteersTicketId: number;
  id: number;
};

type MatchVolunteerIndividual = {
  id: number;
  atendimentosEmAndamento: number;
  email: string;
  name: string;
  organizationId: number;
  latitude: string;
  longitude: string;
  whatsapp: string;
  phone: string;
  registrationNumber: string;
  availability: string;
  pending?: number;
  availabilityCount?: number;
};

const FetchIndividualsForMatch = ({
  organizationId,
  subject,
  children,
  monthlyTimestamp,
  coordinates
}: Props) => {
  const { rows, offset } = useFilterState();

  const recipientVariables = {
    recipientOrganizationId: {
      _eq: zendeskOrganizations["individual"],
    },
  };

  const volunteerVariables = {
    volunteerOrganizationId: {
      _eq: getVolunteerOrganizationId(subject),
    },
    lastMonth: { _gte: monthlyTimestamp },
  };

  const variables =
    organizationId !== zendeskOrganizations["individual"]
      ? recipientVariables
      : volunteerVariables;

  const query =
    organizationId !== zendeskOrganizations["individual"]
      ? RECIPIENTS_FOR_MATCH
      : VOLUNTEERS_FOR_MATCH;

  const { loading, error, data } = useQuery(query, {
    variables,
  });

  if (loading)
    return (
      <WrapLoading>
        <Loading />
      </WrapLoading>
    );
  if (error) {
    console.log("error", error);
    return <p>Error</p>;
  }

  const newData = data.volunteers
    ? data.volunteers
        .map((user: MatchVolunteerIndividual) => {
          const { id } = user;
          const countForwardings = data.pendingTickets.filter(
            (ticket: MatchTickets) => ticket.volunteersUserId === id
          ).length;

          const availabilityCount = 1 - (countForwardings || 0);

          return {
            ...user,
            ultimosEncaminhamentosRealizados: countForwardings,
            availabilityCount,
            coordinates: {
              latitude: user.latitude,
              longitude: user.longitude,
            },
          };
        })
        .filter(
          (user: MatchVolunteerIndividual) => (user.availabilityCount || 0) > 0
        )
    : undefined;

  const individuals = organizationId !== zendeskOrganizations["individual"] 
    ? stripIndividualFromData(data.recipients)
    : newData

  const addDistanceToData = addDistance(coordinates, individuals)

  return children({
    data: addDistanceToData.slice(offset, (rows + offset)),
    count: individuals.length
  });
};

FetchIndividualsForMatch.displayName = "FetchIndividualsForMatch";

// eslint-disable-next-line react/display-name
export default function (props: any = {}): React.ReactElement {
  return <CheckCommunity Component={FetchIndividualsForMatch} {...props} />;
}

import { Injectable } from '@nestjs/common';
import { ConsentCheckRequest, ConsentCheckResponse } from './app.vo';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Error message';
  }

  async consentCheck(consentCheckRequest: ConsentCheckRequest): Promise<ConsentCheckResponse> {
    const clientId = consentCheckRequest.clientId;
    const scope = consentCheckRequest.scope;

    if (scope.split(",").length < 2) {
      return {
        success: false,
        predicates: [],
      };
    }

    const camaraPurpose = scope.split(",")[0];
    const camaraScopes = scope.split(",").slice(1);

    const specifications = this.getSpecification(clientId);

    const matchedSpecification = specifications.filter(
      specification => specification.predicates.some(
        predicate => predicate.purpose.some(
          purpose => purpose === camaraPurpose
        ) && camaraScopes.every(
          camaraScope => predicate.scope.includes(camaraScope)
        )
      )
    );

    if (matchedSpecification.length === 0) {
      return {
        success: false,
        predicates: [],
      };
    }

    return {
      success: true,
      predicates: matchedSpecification[0].predicates,
    };
  }


  private getSpecification(clientId: string): any[] {
    // mock data for test 
    return [
      {
        clientId: clientId,
        predicates: [
          {
            scope: "scope1",
            purpose: "purpose1",
            description: "description1",
          },
          {
            scope: "scope2",
            purpose: "purpose1",
            description: "description2",
          },
        ],
      },
      {
        clientId: clientId,
        predicates: [
          {
            scope: "scope3",
            purpose: "purpose2",
            description: "description3",
          },
          {
            scope: "scope4",
            purpose: "purpose2",
            description: "description4",
          },
        ],
      }
    ];
  }
}

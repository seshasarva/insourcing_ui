// export class DealListing {
//     dealID: string;
//     startDate: string;
//     access: string;
//     status: string;
//     createdBy: string;
//     company: string;
//     headCount: string;
//     geography: string;
// }

export interface DealListing {
      id: string,
      startDate: string,
      access: string,
      status: string,
      createdBy: string,
      company: string,
      geography: string,
      dealAttachments: any,
    }
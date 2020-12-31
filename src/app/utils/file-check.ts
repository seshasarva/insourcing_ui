export class FileCheck{
  private static allowedSpreadSheetExtensions: Array<string> = ['application/vnd.ms-excel',
                                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  private static allowedSpreadSheetSize = 4194304;

  private static allowedPDFExtension = 'application/pdf';


  public static isFileAllowed(file, fileNature){
    let isAllowedFlag = false;

    if(fileNature == 'spreadsheet'){
      if(this.allowedSpreadSheetExtensions.includes(file.type) && file.size <= this.allowedSpreadSheetSize){
        isAllowedFlag = true;
      }
    }

    if(fileNature == 'pdf'){
      if(this.allowedPDFExtension == file.type){
        isAllowedFlag = true;
      }
    }

    return isAllowedFlag;
  }
}

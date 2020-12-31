export class AppConstants {
    //public static get baseURL(): string { return "http://localhost:9000/api"; }

    /* Development */
    private static HOST = 'http://localhost:';
    private static PORT = '8080';
    private static MAPPER = '/insource';

    /* UAT Deployment */
    // public static HOST = 'http://10.169.36.38:';
    // public static PORT = '8080';
    // public static MAPPER = '/InsourcingPortal/api';

   /* Prod Deployment */
    // public static HOST = 'https://10.169.36.36:';
    // public static PORT = '443';
    // public static MAPPER = '/InsourcingPortal/api';

    /* Endpoints */

    public static CANDIDATE_UPLOAD_BULK = '/upload';
    public static CANDIDATE_DOWNLOAD_DETAILS = '/download';
    public static HRBC_LOGIN = '/hrbc/login';
    public static OFFER_PREVIEW_INDIA = '/india/preview/offer';
    public static OFFER_GENERATE_INDIA = '/india/generate/offer/letter';
    public static OFFER_PREVIEW_US = '/us/preview/offer';
    public static OFFER_GENERATE_US = '/us/offer/letter';
    public static RETENTION_PREVIEW = '/preview/retention';
    public static RETENTION_GENERATE = '/retention/letter';
    public static APPOINTMENT_PREVIEW = '/preview/appointment';
    public static APPOINTMENT_GENERATE = '/appointment/letter';
    public static REPORT_APPLICATION_FORM = '/application/form/report';
    public static REPORT_EDUCATION_EMPLOYMENT = '/education/employement/report';
    public static REPORT_OFFER_RETENTION = '/offer/retention/report';
    public static REPORT_INDIA = '/india/report';
    public static RESET_CANDIDATE_PASSWORD = '/change/password';
    public static FETCH_ALL_DEALS = '/deals/fetchAll';
    public static FETCH_DEAL = '/deals/fetchDeal';
    public static HRBC_CREATE_DEAL = '/deals/save';
    public static UPLOAD_FILE_URL = '/deals/upload';
    public static DELETE_FILE_URL = '/deals/deleteFile';
    public static DOWNLOAD_FILE_URL = '/deals/download';
    public static LOAD_DETAILS_DEALS= '/deals/loadDetails';
    public static FETCH_CONTACT_US = '/transistion/fetchContactUsDetails';
    public static FETCH_CANDIDATE_REGISTRATION='/transistion/fetchCrf'
    public static SAVE_CANDIDATE_REGISTRATION='/transistion/saveCrf'
    public static UPLOAD_PROFILE_URL='/transistion/saveContactUsImage'
    public static FETCH_EXPLORE_TCS='/transistion/fetchExploreTcsDetails'
    public static SAVE_EXPLORE_TCS='/transistion/saveExploreTcs' 
    public static SAVE_INTERVIEW_SCHEDULE='/transistion/saveInterviewSchedule'
    public static SAVE_JOURNEY_DETAILS='/transistion/saveJourneyDetails'
    public static FETCH_JOURNEY_DETAILS='/transistion/fetchMyJourneyDetails'
    public static DOWNLOAD_JOURNEY='/transistion/download';
    public static FETCH_INTERVIEW_SCHEDULE='/transistion/fetchInterviewSchedule'
    public static UPLOAD_INTERVIEW_SCHEDULE='/transistion/uploadInterviewSchedule'
    public static UPLOAD_JOURNEY='/transistion/uploadJourneyAttachments'
    public static SAVE_CONTACT_US='/transistion/saveContactUs'
    public static UPLOAD_EXPLORE_TCS='/transistion/uploadExploreTcsAttachments'

    /* Excel Headers */
    public static EXCEL_HEADERS_OFFER_INDIA = ['APPLICANT ID', 'DEPARTMENT', 'DATE OF OFFER', 'TITLE', 'FIRST NAME',
                    'MIDDLE NAME', 'LAST NAME', 'ADDRESS LINE 1', 'ADDRESS LINE 2', 'ADDRESS LINE 3',
                    'TELEPHONE NUMBER', 'DESIGNATION', 'GRADE', 'POSTING BRANCH', 'CANDIDATE ROLE',
                    'SUPERVISOR ROLE', 'Relevant Experience', 'BASIC_M', 'MVA_M', 'QVA_M', 'CITY_ALLOWANCE_M',
                    'BOB_M', 'HRA_M', 'LTA_M', 'FOODCOUPONS_M', 'CAR_ALLOWANCE_M', 'VEHICLE_M', 'FUEL_ALLOWANCE_M',
                    'PERALLOWANCE_M', 'PF_M', 'GRATUITY_M', 'ANNUAL_RETIRALS_M', 'CTC_M', 'BASIC_A', 'MVA_A',
                    'QVA_A', 'CITY_ALLOWANCE_A', 'HRA_A', 'LTA_A', 'FOODCOUPONS_A', 'CAR_ALLOWANCE_A',
                    'VEHICLE_A', 'FUEL_ALLOWANCE_A', 'PERALLOWANCE_A', 'BOB_A', 'HIS_III', 'PF_A', 'GRATUITY_A',
                    'ANNUAL_RETIRALS_A', 'RET_INC_A', 'CTC_A', 'PROBATION_PERIOD', 'PROBATION_UNIT',
                    'CANDIDATE EMAIL', 'DATE_OF_JOINING', 'JOINING_BRANCH', 'EXGRATIA'];

    public static EXCEL_HEADERS_OFFER_US = ['Date', 'First Name', 'Last Name', 'Address', 'Address 2',
                                            'City, State, Zip Code', 'Role/Job Title', 'Reporting To',
                                            'Reporting Address', 'Join Date', 'Base $', 'Exemption Status',
                                            'Bonus $', 'Severance $', 'Offer Response Date', 'Email Id'];

    public static EXCEL_HEADERS_RETENTION = ['Date', 'First Name', 'Last Name', 'Address', 'Address 2',
                                            'Bonus $', 'Work State', 'Email ID', 'City,State,Zip Code'];

    public static EXCEL_HEADERS_APPOINTMENT = ['Applicant Id', 'title', 'First Name', 'Middle Name', 'Last Name',
                                                'Designation', 'Grade', 'Joining Date', 'Emp No', 'Email Id',
                                                'Joining Branch'];

    //Modal Messages

    public static ALLOWED_SPREADSHEET_FILE = 'Microsoft Excel file (.xls, .xlsx) of size less than 5MB is only accepted';
    public static ALLOWED_PDF_FILE = 'PDF file of size less than 5MB is only accepted'


    public static getBaseURL(){
       /*prod*/

        // return location.origin + AppConstants.MAPPER;

       /*Development*/

       return AppConstants.HOST + AppConstants.PORT + AppConstants.MAPPER;
    }


}

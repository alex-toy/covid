export interface Delivery {
    recordid : string;
    fields : {
        etat : string;
        reg_name : string;
        vaccine_type : string;
        received_dose_total : number;
        received_ucd_total : number;
    }
}
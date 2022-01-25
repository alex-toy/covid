export interface Record {
    "recordid": string,
    "fields": {
        "tot_recovered": number,
        "tot_positive": number,
        "tot_death_hosp": number,
        "tot_hosp": number,
        "count_new_icu": number,
        "tot_icu": number,
        "count_new_hosp": number,
        "date": string,
        "tot_death_ephad": number,
    }
}
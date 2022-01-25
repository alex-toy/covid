export interface Place {
    "recordid": string,
    "fields": {
        "dep_name": string,
        "reg_name": string,
        "name": string,
        "opening_date" : string,
        "closing_date" : string,
        "geo_point_2d": number[],
    }
}

/**
 * @author Inlinkcraft
 * @version 2024-08-26 - Inlinkcraft
 */

import { Calendar } from "./calendar";

/**
 * Repeater is a helper class to generate repeating events
 */
export class Repeater {

    type:string;
    startDate:Date|undefined;
    endDate:Date|undefined;

    /**
     * Create the repeater from a yaml object.
     * @param yamlObject is the object that the information parsed from.
     */
    constructor(yamlObject:any|undefined){
        
        if (yamlObject){

            if(yamlObject.type){
                this.type = yamlObject.type;
            }

            if(yamlObject.startDate){
                this.startDate = yamlObject.startDate;
            }

            if(yamlObject.endDate){
                this.endDate = yamlObject.endDate;
            }

            if(yamlObject.until){
                this.endDate = yamlObject.until;
            }

        } else {
            this.type = "none"
        }

    }
    

    /**
     * Evaluate if the days are equivalent base on the repeat type, start date and end date.
     * @param anchor is the date the repeater evaluate the repeat from.
     * @param date is the date we want to know is equivalent.
     * @returns true if the date is a equivalent repeat day.
     */
    equivalentDay(anchor:Date, date:Date) : boolean {

        if (this.startDate){
            if (date < this.startDate){
                return false;
            }
        }

        if (this.endDate) {
            if (date > this.endDate){
                return false;
            }
        }

        switch(this.type) {

            case "none":{
                return anchor.getFullYear() == date.getFullYear() &&
                anchor.getMonth() == date.getMonth() &&
                anchor.getDate() == date.getDate();
            }

            case "daily":{
                return true;
            }

            case "weekly":{
                return anchor.getDay() == date.getDay();
            }

            case "monthly":{
                return anchor.getDate() == date.getDate();
            }

            case "yearly":{
                return anchor.getDate() == date.getDate() && anchor.getMonth() == date.getMonth();
            }

            default:{
                throw Error("Invalid type for repearter - validate your repeater type. You may want to use repeater.validate()")
            }

        }

    }

    getNextEquivalentDay(anchor:Date, dateToAjust:Date): Date|undefined {

        let date:Date = new Date(dateToAjust);

        switch(this.type) {

            case "none":{
                break;
            }

            case "daily":{
                break;
            }

            case "weekly":{
                let dayDelta = anchor.getDay() - dateToAjust.getDay();
                if (dayDelta < 0) {dayDelta = dayDelta + 7};
                date.setDate(dateToAjust.getDate() + dayDelta)

                break;
            }

            case "monthly":{
                let monthDelta = anchor.getMonth() - dateToAjust.getMonth();
                if (monthDelta < 0) {monthDelta = monthDelta + 12};
                date.setMonth(dateToAjust.getMonth() + monthDelta)

                break;
            }

            case "yearly":{
                if (anchor.getMonth() > dateToAjust.getMonth()){
                    dateToAjust.setMonth(anchor.getMonth());
                } else if (anchor.getMonth() < dateToAjust.getMonth()){
                    dateToAjust.setMonth(anchor.getMonth());
                    dateToAjust.setFullYear(dateToAjust.getFullYear() + 1);
                }
                break;
            }

            default:{
                throw Error("Invalid type for repearter - validate your repeater type. You may want to use repeater.validate()")
            }

        }

        if (this.startDate){
            if (date < this.startDate){
                return undefined;
            }
        }

        if (this.endDate) {
            if (date > this.endDate){
                return undefined;
            }
        }

        return date;

    }

    /**
     * Get the valid state of the repeater. Valid types are: none, daily, weekly, monthly and yearly.
     * @returns true if the repeater is valid.
     */
    validate() : boolean {
        return (this.type == "daily" || this.type == "weekly" || this.type == "monthly" || this.type == "yearly" || this.type == "none");
    }
}
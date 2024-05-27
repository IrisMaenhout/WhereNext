import Joi from 'joi';
import { ObjectId } from "mongodb";

export const idSchema = Joi.alternatives().try(
    Joi.string().length(12).hex(),
    Joi.string().length(24).hex(),
    Joi.number().integer().positive()
);


export function isValidObjectId(id){
     
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;        
        return false;
    }
    return false;
}

import Gmail from "./Gmail"

export default class Label {
    static create = async (name) =>{
        return await Gmail.createLabel(name);
    } 
}

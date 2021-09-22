import {Person} from './../../person/person';

export class Store{
	id: string;
	title: string;
	address: string;
	location: {long:number, lat: number};
	owner: Person;
	status: string;
}


/*attributes: {
	storeId:{type: "string"},
	title: {type: "string", required:true},
	address:{model: "Address"},
	location:{type: "json"},
	person: {model: "person"},
	status: {type: "string", defaultsTo: "Active"}
}*/
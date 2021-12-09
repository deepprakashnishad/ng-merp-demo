import {Person} from './../../person/person';

export class Store{
	id: string;
	title: string;
	address: string;
	logo: string;
	headerText: string;
	location: {long:number, lat: number};
	owner: Person;
	status: string;

	static fromJSON(data){
		var store = new Store();
		store.id = data['id'];
		store.title = data['title'];
		if(data.location){
			store.location = data['location']
		}
		if(data.owner){
			store.owner = data['owner'];
		}
		if(data.status){
			store.status = data['status'];
		}
		if(data.logo){
			store.logo = data['logo'];
		}

		if(data.headerText){
			store.headerText = data['headerText'];
		}

		return store;
	}
}


/*attributes: {
	storeId:{type: "string"},
	title: {type: "string", required:true},
	address:{model: "Address"},
	location:{type: "json"},
	person: {model: "person"},
	status: {type: "string", defaultsTo: "Active"}
}*/
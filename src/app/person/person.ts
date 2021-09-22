import {Role} from './../admin/role/role';
import {Permission} from '../admin/permission/permission';

export class Person{
	id: string;
	name: string;
	mobile: string;
	email: string;
	role: Role;
	permissions: Permission[];
	status: string;
	password: string;

	constructor(){
		this.email = "";
		this.mobile = "";
		this.name = "";
		this.permissions = [];
		this.status = "";
		this.role = new Role();
		this.password = "";
  }

  static fromJSON(data) {
    var person = new Person();

    person.name = data['name'];
    person.mobile = data['mobile'];
    person.email = data['email'];

    return person;
  }

  static fromJSONArray(arrJson: Array<any>) {
    var persons: Array<Person> = [];
    for (var data of arrJson) {
      persons.push(this.fromJSON(data));
    }

    return persons;
  }
}

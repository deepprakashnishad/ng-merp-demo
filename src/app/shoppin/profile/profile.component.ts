import { Component } from "@angular/core";
import { PersonService } from "../../person/person.service";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent {

  constructor(private personService: PersonService) {

  }
}

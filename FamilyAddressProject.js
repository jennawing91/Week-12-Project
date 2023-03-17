//create a family member object
class Member {
    constructor(name) {
        this.name = name;
        this.address = [];
       // this.dates = [];
       // this.connection = connection;
    }

    addInfo(address, city, state, zip, email, phone) {    //pushes the user input into the member information
        this.address.push(new Address(address, city, state, zip, email, phone));
       // this.dates.push(new Dates(dates));
        //this.connection.push(new Connection(connection));
        console.log(Address)
    }
}

//create a family member address object
class Address {
    static counter = 0;
    constructor(name, address, city, state, zip, email, phone) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.email = email;
        this.phone = phone;
        this._id = Address.counter++;
    }            
}

//create a family member's important dates
// class Dates {
//     constructor(name, birthday, marriage, death) {
//         this.name = name;
//         this.birthday = birthday;
//         this.marriage = marriage;
//         this.death = death;
//     }
// }

//create a family member's connection to the Original 14
// class Connection {
//     constructor(original14, relationship) {
//         this.original14 = original14;
//         this.relationship = relationship;
//     }
// }

//connect to API
class AddressBook {
    static url = 'https://64097c3e6ecd4f9e18b1ed08.mockapi.io/api/FamilyMembers';  //root url for all endpoints when we call on the api

    static getAllMembers() {     //returns all members from the api
        let data = $.get(this.url);
        console.log(data);
        return data;
    }

    static getMembers(id) {         //returns a specified member from the api
        return $.get(this.url + `/${id}`);
    }

    static createMembers(member) {        //creates a new member profile in the api after user input
        return $.post(this.url, member);
    }

    static updateMembers(member) {     //updates a members information after member has been created
        return $.ajax({
            url: this.url + `/${member._id}`,
            dataType: 'json',
            data: JSON.stringify(member),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteMembers(id) {     //deletes a member from the api
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}
//create a table of all family members & update table with each create
//table should have name, full address, dates & connection
//create a new family member
//update a family member
//remove a family member
//create a search for a family member by name or connectionclass DOMManager {
class DOMManager{  
    static members;

    static getAllMembers() {             //after api returns all member information it will render it to the address book
        AddressBook.getAllMembers().then((members) => this.render(members));
    }

    static createMembers(name) {         //after api receives input request will return a new member profile
        AddressBook.createMembers(new Member(name)).then(() => {
            return AddressBook.getAllMembers().then((members) => this.render(members))
        })
    }

    static deleteMembers(id) {           //deletes members from the address book once input has been received by the api

        AddressBook.deleteMembers(id)
            .then(() => {
                return AddressBook.getAllMembers();
            })
            .then((members) => this.render(members))
    }

    static addAddress(id) {             //adds member information
        for(let member of this.members) {
            if (member._id == id) {
                member.address.push(new Address($(`#${member._id}-member-street-address`).val(), $(`#${member._id}-member-city`).val(),
                $(`#${member._id}-member-state`).val(),$(`#${member._id}-member-zip`).val(), $(`#${member._id}-member-phone`).val(),
                $(`#${member._id}-member-email`).val()));
                AddressBook.updateMembers(member) 
                    .then(() => {
                        return AddressBook.getAllMembers();
                    })
                    .then((members) => this.render(members));
            }
        }
    }

    static deleteAddress(memberId, addressId) {         //updates member by deleting current info
        for(let member of this.members) {
            if(member._id == memberId) {
                for(let address of member.address) {
                    if (address._id == addressId) {
                        member.address.splice(member.address.indexOf(address), 1);
                        AddressBook.updateMembers(member)
                            .then(() => {
                                return AddressBook.getAllMembers();
                            })
                            .then(() => this.render(this.members));
                    }
                }
            }
        }
    }

    static render(members) {             //creates a form for the user to add information about the family member and then renders that to the page
        this.members = members;
        $('#app').empty();
        for(let member of members) {
            $('#app').prepend(
                `<div id="${member._id}" class="card" style="background-image: url(Img/rainbow_coloured_watercolour_texture_background_2907.jpg); opacity:0.95">
                    <div class="card-header">
                        <h2 style="background-image: url(Img/rainbow_coloured_watercolour_texture_background_2907.jpg); opacity:0.8; 
                            font-family: Arial, Helvetica, sans-serif;">${member.name}</h2>
                        <button class="btn btn-dark" onclick="DOMManager.deleteMembers(${member._id})">Delete Member</button>
                    </div>
                    <div class="card-body" style="background-image: url(Img/rainbow_coloured_watercolour_texture_background_2907.jpg); opacity:0.8">
                        <div class="card">
                            <div class="row">
                                <div>
                                    <input type="text" id="${member._id}-member-street-address" class="form-control" placeholder="Member Street Address"><br>
                                </div>
                                <div>
                                    <input type="text" id="${member._id}-member-city" class="form-control" placeholder="Member City"><br>
                                </div>
                                <div>
                                    <input type="text" id="${member._id}-member-state" class="form-control" placeholder="Member State"><br>
                                </div>
                                <div>
                                    <input type="text" id="${member._id}-member-zip" class="form-control" placeholder="Member Zip"><br>
                                </div>
                                <div>
                                    <input type="text" id="${member._id}-member-phone" class="form-control" placeholder="Member Phone"><br>
                                </div>
                                <div>
                                    <input type="text" id="${member._id}-member-email" class="form-control" placeholder="Member Email"><br>
                                </div>

                            </div>
                            <button id="${member._id}-new-address" onclick="DOMManager.addAddress(${member._id})" class="btn btn-primary btn-sm">Add Contact Info</button>
                        </div>
                    </div>
                </div><br>
                ` 
            );
            for(let address of member.address) {       //iterates over the member to be updated and adds the fields to the member info
                $(`#${member._id}`).find(`.card-body`).append(
                    `<p>
                        <span id="name.${Address._id}"><strong>Name: </strong> ${address.name}</span>
                        <span id="address.${Address._id}"><strong>Address: </strong> ${address.address}</span>
                        <span id="city.${Address._id}"><strong>City: </strong> ${address.city}</span>
                        <span id="state.${Address._id}"><strong>State: </strong> ${address.state}</span>
                        <span id="zip.${Address._id}"><strong>Zip Code: </strong> ${address.zip}</span>
                        <span id="phone.${Address._id}"><strong>Phone Number: </strong> ${address.phone}</span>
                        <span id="email.${Address._id}"><strong>Email: </strong> ${address.email}</span>

                        <button class="btn btn-dark" onclick="DOMManager.deleteAddress(${member._id}, ${address._id})">Delete Contact Info</button>
                    </p>`
                )
            }
        }
    }
}

$(`#create-new-member`).click(() => {     //creates a new member upon user input
    DOMManager.createMembers($(`#new-member-name`).val());
    $(`new-member-name`).val('');
});

DOMManager.getAllMembers();


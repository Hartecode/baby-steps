'use strict';

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
let listOfBabies;

console.log(token);
console.log(userId);

//this function submits a new post of a baby under the current user id
function submitBabyInfo(){
	$('.babyfileinput').on('submit', function(event) {
		event.preventDefault();
		const babyFirstName = $('.babyfirstname').val();
		const babyMiddleName = $('.babymiddlename').val();
		const babyLastName = $('.babylastname').val();
		const dateOfBirth = $('.dateofbirth').val();
		const babyGender = $('.babygender').val();
		const birthCity= $('.birthCity').val();
		const birthWeight = $('.birthweight').val();
		const birthLength = $('.birthlength').val();
		const motherFirstName = $('.motherfirstname').val();
		const motherMiddleName = $('.mothermiddlename').val();
		const motherLastName = $('.motherlastname').val();
		const fatherFirstName = $('.fatherfirstname').val();
		const fatherMiddleName = $('.fathermiddlename').val();
		const fatherLastName = $('.fatherlastname').val();
		$.ajax({
			type:'POST',
            url: `/api/users/baby/${userId}`,
            data: JSON.stringify({
                'baby': {
		          'name': {
		            'firstName': babyFirstName,
		            'middleName': babyMiddleName,
		            'lastName': babyLastName
		          },
		          'dateOfBirth': dateOfBirth,
		          'sex': babyGender,
		          'parents': {
		            'mother': {
		              'motherFirstName': motherFirstName,
		              'motherMiddleName': motherMiddleName,
		              'motherLastName': motherLastName
		            },
		            'father': {
		              'fatherFirstName': fatherFirstName,
		              'fatherMiddleName': fatherMiddleName,
		              'fatherLastName':fatherLastName
		            }
		          },
		          'birthCity': birthCity,
		          'birthWeight': birthWeight,
		          'birthLength': birthLength
		        },
		        'userID': userId
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => console.log(error)
		});
		clearInputs();
	})
}

//this function clears the inputs on the dash board
function clearInputs() {
	$('.babyfirstname').val('');
	$('.babymiddlename').val('');
	$('.babylastname').val('');
	$('.dateofbirth').val('');
	$('.babygender').val('');
	$('.birthCity').val('');
	$('.birthweight').val('');
	$('.birthlength').val('');
	$('.motherfirstname').val('');
	$('.mothermiddlename').val('');
	$('.motherlastname').val('');
	$('.fatherfirstname').val('');
	$('.fathermiddlename').val('');
	$('.fatherlastname').val('');
}

function getAllBabyInputs() {
	$.getJSON(`/api/users/baby/${userId}`, function(json) {
		listOfBabies = json.map(obj =>{
			return babySnapShotHTML(obj);
		});
		$('.listofbabys').html(listOfBabies);
	});
}


function babySnapShotHTML(babyObj) {
	let babyId = babyObj.id;
	let first = babyObj.baby.name.firstName;
	let middle = babyObj.baby.name.middleName;
	let last = babyObj.baby.name.lastName;
	let age = babyObj.baby.dateOfBirth;
	return `<div id="${babyId}"class="snapBaby box-structure">
					<div class="snapName">
						<h4>Name:</h4>
						<p>${first} ${middle} ${last}</p>
					</div>
					<div class="snapAge">
						<h4>Age:</h4>
						<div class="currentage">${age}</div>
						<p>months</p>
					</div>
					<div class="snapMilestone">
						<h4>Recent Milestone:</h4>
						<div class="milestone">
							<div class="stonedate">06/20/18</div>
							<div class="stonetitle">Took the baby out to the mesuime for the first time</div>
						</div>
					</div>
				</div>`
}

$('.listofbabys').on('click', '.snapBaby', function() {
	console.log($(this).attr('id'));
	localStorage.setItem('babyId', $(this).attr('id'));
	window.location = 'milestone.html';
});

function runDashBoard() {
	submitBabyInfo();
	getAllBabyInputs();
}

$(runDashBoard());
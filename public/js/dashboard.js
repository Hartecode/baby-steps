'use strict';

// const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
let listOfBabies;

// console.log(token);
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
            beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 	},
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
            error:  error => {
				if(error.responseText === 'Unauthorized') {
					window.location = 'index.html';
				}
				console.log(error);
			}
		});
		getAllBabyInputs();
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

//this function gets all the babies frothe server
function getAllBabyInputs() {
	$.ajax({
		type:'GET',
        url: `/api/users/baby/${userId}`,
        beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 },
		error: error => {
			if(error.responseText === 'Unauthorized') {
				window.location = 'index.html';
			}
			console.log(error);
		},
		success: function(json) {
				listOfBabies = json.map(obj =>{
			return babySnapShotHTML(obj);
		});
		$('.listofbabys').html(listOfBabies);		}
	})
	.done(function(){
		let ids = $('.snapBaby').map(function() {
		  return $(this).attr('id');
		});
		for(let i = 0; i < ids.length; i++) {
			$.getJSON(`/api/users/milestone/${ids[i]}`, function(data) {
				console.log(data);
				if(data.length === 0 ){
					$(`#${ids[i]} .stonetitle`).text('Currently no milestones posted.');
				} else {
					let mileDate = data[0].date;
					let mileTitle = data[0].title;
					$(`#${ids[i]} .stonedate`).text(mileDate);
					$(`#${ids[i]} .stonetitle`).text(mileTitle);
				}
				
			});
		}		
	});
}





//this is the html of the listed baby
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
							<div class="stonedate"></div>
							<div class="stonetitle"></div>
						</div>
					</div>
				</div>`
}

//when listed baby is clicked it saves the id  to baby id and opens the milesotne page
$('.listofbabys').on('click', '.snapBaby', function() {
	console.log($(this).attr('id'));
	localStorage.setItem('babyId', $(this).attr('id'));
	window.location = 'milestone.html';
});

//when add baby link is clicked the form expands
$('.addbaby').on('click', function() {
	$('.babyforminput').toggleClass('hidden');
});

function runDashBoard() {
	submitBabyInfo();
	getAllBabyInputs();
}

$(runDashBoard());
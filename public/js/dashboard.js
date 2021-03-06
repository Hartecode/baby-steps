'use strict';

// const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

function getUserInfo() {
	$.ajax({
		type:'GET',
        url: `/api/users/${userId}`,
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
			let firstName = json.firstName
			$('.usergreeting').text(firstName)		
		}
	})
}


//this function submits a new post of a baby under the current user id
function submitBabyInfo(){
	$('.babyfileinput').on('submit', function(event) {
		event.preventDefault();
		const babyFirstName = $('.babyfirstname').val();
		const babyMiddleName = $('.babymiddlename').val();
		const babyLastName = $('.babylastname').val();
		const dateOfBirth = $('.dateofbirth').val();
		const birthCity= $('.birthCity').val();
		const birthWeight = $('.birthweight').val();
		const birthLength = $('.birthlength').val();

		$.ajax({
			type:'POST',
            url: `/api/baby/${userId}`,
            beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 	},
            data: JSON.stringify({
		        'firstName': babyFirstName,
		        'middleName': babyMiddleName,
		        'lastName': babyLastName,
		        'dateOfBirth': dateOfBirth,
		        'birthCity': birthCity,
		        'birthWeight': birthWeight,
		        'birthLength': birthLength,
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
		$('.modal').fadeOut();
	})
}

//this function clears the inputs on the dash board
function clearInputs() {
	$('.babyfirstname').val('');
	$('.babymiddlename').val('');
	$('.babylastname').val('');
	$('.dateofbirth').val('');
	$('.birthCity').val('');
	$('.birthweight').val('');
	$('.birthlength').val('');
}

//this fucntion calculates the how many months between dates
function monthDiff(pastDate) {
	let d2 = new Date();
	let d1 = new Date(pastDate);
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

//this function gets all the babies frothe server
function getAllBabyInputs() {
	
	$.ajax({
		type:'GET',
        url: `/api/baby/${userId}`,
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
			let listOfBabies;
			let listOfBabyMile;
			if(json.length < 1) {
				$('.startdash').fadeIn();
				$('.listofbabys').html('<h3>There are no babies listed</h3>');
			}else {
				listOfBabies = json.map(obj =>{
				return babySnapShotHTML(obj);
				});

				listOfBabyMile = json.map(obj => {
					return milestoneHTML(obj);
				});

				$('.babyMileList').html(listOfBabyMile);
				$('.listofbabys').html(listOfBabies);	
			}	
		}
	})
	.done(function(){
		let ids = $('.snapBaby').map(function() {
		  return $(this).attr('id');
		});
		
		for(let i = 0; i < ids.length; i++) {
			$.ajax({
				type:'GET',
		        url: `/api/milestone/${ids[i]}`,
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
					if(json.length === 0 ){
						$(`#${ids[i]} .stonetitle`).text('Currently no milestones posted.');	
					} else {
						let mileTitle = json[0].title;
						$(`.listofbabys #${ids[i]} .stonetitle`).text(mileTitle);
					}		
				}		
			});
		}		
	});
}





//this is the html of the listed baby
function babySnapShotHTML(babyObj) {
	let babyId = babyObj.id;
	let first = babyObj.firstName;
	let middle = babyObj.middleName[0];
	let last = babyObj.lastName;
	let age = babyObj.dateOfBirth;
	return `	<div id="${babyId}" class="snapBaby box-structure">
					<div class="snapName">
						<h2>${first} ${middle} ${last}</h2>
					</div>
					<div class="snapAt"><h3>At</h3></div>
					<div class="snapAge">
						<h4>Currnet Age:</h4>
						<div class="currentage">${monthDiff(age)}</div>
						<p>Months old</p>
					</div>
					<div class="snapMilestone">
						<h4>Recent Milestone:</h4>
						<div class="milestone">
							<div><i class="fas fa-star"></i><span class="stonetitle">You haven't added a milestone yet</span></div>
						</div>
					</div>
				</div>`;
}

function milestoneHTML(babyObj) {
	let babyId = babyObj.id;
	let first = babyObj.firstName;
	return `<div id="${babyId}" class="selectbaby">
					<div id="">
						<p><i class="fas fa-star"></i><span>${first}</span></p>
					</div>
				</div>`;
}

//when listed baby is clicked it saves the id  to baby id and opens the milesotne page
$('.listofbabys').on('click', '.snapBaby', function() {
	localStorage.setItem('babyId', $(this).attr('id'));
	window.location = 'milestone.html';
});
//listener for the short baby list clicked it saves the id  to baby id and opens the milesotne page
$('.babyMileList').on('click', '.selectbaby', function() {
	localStorage.setItem('babyId', $(this).attr('id'));
	window.location = 'milestone.html';
});

//when add baby link is clicked the form expands
$('.addbaby').on('click', function() {
	$('.babyforminput').fadeIn();
});

//close modal when closed button clicked
$('.closebtn').on('click', function(){
	$('.modal').fadeOut();
});

function runDashBoard() {
	getUserInfo();
	submitBabyInfo();
	getAllBabyInputs();
}

$(runDashBoard());
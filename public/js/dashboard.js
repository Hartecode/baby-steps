'use strict';

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

console.log(token);
console.log(userId);

function submitBabyInfo(){
	console.log('babyfileinput: running');
	$('.babyfileinput').on('submit', function(event) {
		console.log("submit pressed")
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

}

function runDashBoard() {
	submitBabyInfo();
}

$(runDashBoard());
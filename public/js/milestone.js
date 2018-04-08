'use strick';

const babyId = localStorage.getItem('babyId');
console.log(babyId);

let listOfMilestones;
let babyInfoJSON;


///get the individual baby info
function getBabyInputs() {

	$.ajax({
		type:'GET',
        url: `/api/users/baby/single/${babyId}`,
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
			window.location = 'dashboard.html';
			console.log(error);
		},
		success: function(json) {
		$('.bfirstname').text(json.firstName);
		babyInfoJSON = json;
				
		}
	});
}

///this functon post new milestones to sever
function postMilestone(){
	$('.mileinput').on('submit', function(event) {
		event.preventDefault();
		let milestoneDate = $('.miledate').val();
		let milestoneTitle = $('.miletitle').val();
		let milestoneDec = $('.miledescription').val();
		$.ajax({
            type:'POST',
            url: `/api/users/milestone/${babyId}`,
            beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 	},
            data: JSON.stringify({
                "title": milestoneTitle,
				"description": milestoneDec,
				"date": milestoneDate,
				"babyID": babyId
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => console.log(error)
        });
        clearInputs();
        getAllMilestones();
        $('.modal').fadeOut();
	});
}

//this clears all the imputs on the page
function clearInputs() {
	$('.miledate').val('');
	$('.miletitle').val('');
	$('.miledescription').val('');
}


//this gets all the mile stons post and apples the info to html which is then posted to te page
function getAllMilestones() {
	$.ajax({
		type:'GET',
        url: `/api/users/milestone/${babyId}`,
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
			console.log(json);
			if(json.length < 1) {
				$('.startmile').fadeIn();
				$('.milestonelist').html('<h3>No Milestones on file</h3>');
			} else {
				listOfMilestones = json.map(obj => {
					return milestoneHTML(obj);
				});
				$('.milestonelist').html(listOfMilestones);
			}
		}
	});
}

//this holds the html for the baby form
function babyHTML(obj) {
	const babyFirstName = obj.firstName;
	const babyMiddleName = obj.middleName;
	const babyLastName = obj.lastName;
	const dateOfBirth = obj.dateOfBirth;
	const birthCity= obj.birthCity;
	const birthWeight = obj.birthWeight;
	const birthLength = obj.birthLength;
	return `<form role="form" class="babyfileinput modal-content">
						<div><i class="fas fa-times fa-3x closebtn"></i></div>
						<fieldset class="row">
							<h3>Baby</h3>
							<div class="row">
								<div class="col-4">
									<label for="firstName">First Name:</label>
									<br>
									<input class="babyfirstname disabledInp" type="text" name="firstName" value="${babyFirstName}" disabled>
								</div>
								<div class="col-4">
									<label for="middleName">Middle Name:</label>
									<br>
									<input class="babymiddlename disabledInp" type="text" name="middleName" value="${babyMiddleName}" disabled>
								</div>
								<div class="col-4">
									<label for="lastName">Last Name:</label>
									<br>
									<input class="babylastname disabledInp" type="text" name="lastName" value="${babyLastName}" disabled>
								</div>
							</div>

							<div class="row">
								
								<div class="col-3">
									<label for="dateOfBirth">Date of Birth:</label>
									<br>
									<input class="dateofbirth disabledInp" type="date" name="dateOfBirth" value="${dateOfBirth}" disabled>
								</div>
								<div class="col-3">
									<label for="birthLength">birth length:</label>
									<br>
									<input class="birthlength disabledInp" type="text" name="birthLength" value="${birthLength}" disabled>
								</div>
								<div class="col-3">
									<label for="birthCity">Birth city:</label>
									<br>
									<input class="birthCity disabledInp" type="text" name="birthCity" value="${birthCity}" disabled>
								</div>
								<div class="col-3">
									<label for="birthWeight">birth weight:</label>
									<br>
									<input class="birthweight disabledInp" type="text" name="birthWeight" value="${birthWeight}" disabled>
								</div>
							</div>
							
							<div class="">
								<input id="editbaby" class="btn nutrbtn" type="button" value="Edit">
								<input id="deletebaby" class="btn negbtn disabledInp" type="button" value="Delete Baby Info & Milestones" disabled>
								<input class="btn posbtn disabledInp" type="submit" value="Submit" disabled>
							</div>
							
						</fieldset>
				</form>`;
}

//tis functoon is the html for the milestones
function milestoneHTML(obj) {
	let stoneId = obj.id;
	let stoneDate = obj.date;
	let stoneTitle = obj.title;
	let stoneDec = obj.description;
	return `<div id="${stoneId}" class="fullstone">
				<div class="stonecontainer">
				<div class="milestonedate">${stoneDate}</div>
				<div class="milestonetitle">${stoneTitle}</div>
				<div class="milebtn"><button class="view-dec btn posbtn">+</button></div>
				</div>
				<div class="milehidden hidden">
					<div class="milestonedesc">${stoneDec}</div>
					<div>
						<button class="editstone btn nutrbtn">edit</button>	
						<button class="deletstone btn negbtn">delete</button>
					</div>
					
				</div>

			</div>`;
}

//this functions deletes milestones from the sever and reloads the updated list of milestones
$('.milestonelist').on('click', '.deletstone', function() {
	let delteItemId = $(this).closest('.fullstone').attr('id');
	$.ajax({
            type:'DELETE',
            url: `/api/users/milestone/${delteItemId}`,
            beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 	},
            error: error => console.log(error)
        });
	getAllMilestones();
});

//this function opens the edit modal
$('.milestonelist').on('click', '.editstone', function() {
	let editItemId = $(this).closest('.fullstone').attr('id');
	let date = $(this).closest('.fullstone').find('.milestonedate').text();
	let title = $(this).closest('.fullstone').find('.milestonetitle').text();
	let desc = $(this).closest('.fullstone').find('.milestonedesc').text();
	$('.mile-edit').fadeIn();
	$('.mile-edit').html(milestoneEditHtml(editItemId, date, title, desc));
});

//this is the html for the edit mileston
function milestoneEditHtml(id, date, title, desc){

	return `<form role="form" id="${id}" class="mileinput modal-content">
				<fieldset class="row">
					<div><i class="fas fa-times fa-3x closebtn"></i></div>
					<div class="col-3">
						<label for="date">Date:</label>
						<br>
						<input class="miledate-edit" type="date" name="date" value="${date}">
						<br>
						<label for="milestones">Milestone:</label>
						<br>
						<input class="miletitle-edit" type="text" name="milestones" value="${title}">
					</div>
					
					<div class="col-6">
						<label for="description">Description:</label>
						<br>
						<textarea class="miledescription-edit" rows="5" name="description">${desc}</textarea>
					</div>
					<div class="col-3">
						<button class="btn posbtn" type="submit">Submit edit</button>
					</div>
					
				</fieldset>
			</form>	`;
}

//this deletes the baby and their milestones
$('.baby-edit').on('click', '#deletebaby', function() {
	console.log('baby info/milestones: deleted');
	$.ajax({
            type:'DELETE',
            url: `/api/users/baby/${babyId}`,
            beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 	},
            error: error => console.log(error)
        });
	sessionStorage.removeItem('babyId');
	window.location = 'dashboard.html';
});

//this funtion submits and edit the baby's info
$('.baby-edit').on('submit', function(e) {
	e.preventDefault();
	const babyFirstName = $(this).closest('.baby-edit').find('.babyfirstname').val();
	const babyMiddleName = $(this).closest('.baby-edit').find('.babymiddlename').val();
	const babyLastName = $(this).closest('.baby-edit').find('.babylastname').val();
	const dateOfBirth = $(this).closest('.baby-edit').find('.dateofbirth').val();
	const birthCity= $(this).closest('.baby-edit').find('.birthCity').val();
	const birthWeight = $(this).closest('.baby-edit').find('.birthweight').val();
	const birthLength = $(this).closest('.baby-edit').find('.birthlength').val();
	const dataPut = JSON.stringify({
			'id': babyId,
	        'firstName': babyFirstName,
	        'middleName': babyMiddleName,
	        'lastName': babyLastName,
	        'dateOfBirth': dateOfBirth,
	        'birthCity': birthCity,
	        'birthWeight': birthWeight,
	        'birthLength': birthLength
	    });
	console.log(dataPut);
	$.ajax({
		type: "PUT",
		url: `api/users/baby/${babyId}`,
		beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 }, 
		data: dataPut,
	    dataType: 'json',
	    contentType: "application/json",
	    error: error => console.log(error)
	})
	.done(function(){
		getBabyInputs();
	});
	outEmptyModal($(this));
});

//this function submits and edit to the milestone post
$('.mile-edit').on('click', '.posbtn', function(e){
	e.preventDefault();
	let editItemId = $(this).closest('.mile-edit').find('form').attr('id');
	let date = $(this).closest('.mile-edit').find('.miledate-edit').val();
	let title = $(this).closest('.mile-edit').find('.miletitle-edit').val();
	let desc = $(this).closest('.mile-edit').find('.miledescription-edit').val();
	$.ajax({
		type: "PUT",
		url: `api/users/milestone/${editItemId}`,
		beforeSend : function(xhr) {
		      // set header if JWT is set
		      if (window.sessionStorage.accessToken) {
		          xhr.setRequestHeader("Authorization", "Bearer " +  window.sessionStorage.accessToken);
		      }
		 }, 
		data: JSON.stringify({
				"id": editItemId,
	            "title": title,
				"description": desc,
				"date": date
	    }),
	    dataType: 'json',
	    contentType: "application/json",
	    error: error => console.log(error)
	});
	outEmptyModal($(this));
	getAllMilestones();
});

///click listner for the view/edit for baby which fades in the edit modal
$('.babyview-edit').on('click',function() {
	$('.baby-edit').html(babyHTML(babyInfoJSON));
	$('.baby-edit').fadeIn();
})

//click listenr for edit button for baby which allows the form to able to eidt
$('.baby-edit').on('click','#editbaby', function(event){
	event.preventDefault();
	console.log('edit clicked');
   $('.disabledInp').prop("disabled", false);
});

//this expands and retracts the milestone info
$('.milestonelist').on('click', '.view-dec', function() {
	$(this).closest('.fullstone').find('.milehidden').toggleClass('hidden');
	($(this).text() == '+')? $(this).text('-'): $(this).text('+');
});

//this is the click listenr for the add milestone button
$('.addmilestonebtn').on('click', function(){
	$('.mile-add').fadeIn();
});

//if a x is clicked on a modal it will close and the modal will empty
$('.modal').on('click', '.closebtn', function() {
	$(this).closest('.modal').fadeOut();
});

function outEmptyModal(element) {
	element.closest('.modal').fadeOut();
	element.closest('.modal').empty();
}



function runMilestone() {
	getBabyInputs();
	postMilestone();
	getAllMilestones();
}

$(runMilestone());
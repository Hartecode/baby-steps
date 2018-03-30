'use strick';

const babyId = localStorage.getItem('babyId');

let listOfMilestones;

console.log(babyId);

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
			console.log(error);
		},
		success: function(json) {
		$('.bfirstname').text(json.baby.name.firstName);
		$('.baby-edit').html(babyHTML(json));		
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
				listOfMilestones = json.map(obj => {
					return milestoneHTML(obj);
				});
				$('.milestonelist').html(listOfMilestones);
		}
	});
}

//this holds the html for the baby form
function babyHTML(obj) {
	const babyFirstName = obj.baby.name.firstName;
	const babyMiddleName = obj.baby.name.middleName;
	const babyLastName = obj.baby.name.lastName;
	const dateOfBirth = obj.baby.dateOfBirth;
	const babyGender = obj.baby.sex;
	const birthCity= obj.baby.birthCity;
	const birthWeight = obj.baby.birthWeight;
	const birthLength = obj.baby.birthLength;
	const motherFirstName = obj.baby.parents.mother.motherFirstName;
	const motherMiddleName = obj.baby.parents.mother.motherMiddleName;
	const motherLastName = obj.baby.parents.mother.motherLastName;
	const fatherFirstName = obj.baby.parents.father.fatherFirstName;
	const fatherMiddleName = obj.baby.parents.father.fatherMiddleName;
	const fatherLastName = obj.baby.parents.father.fatherLastName;
	return `<form class="babyfileinput modal-content">
						<div><i class="fas fa-times fa-3x closebtn"></i></div>
						<fieldset class="row">
							<h3>Baby</h3>
							<div class="row">
								<div class="col-3">
									<label for="firstName">First Name:</label>
									<br>
									<input class="babyfirstname" type="text" name="firstName" value="${babyFirstName}" disabled>
								</div>
								<div class="col-3">
									<label for="middleName">Middle Name:</label>
									<br>
									<input class="babymiddlename" type="text" name="middleName" value="${babyMiddleName}" disabled>
								</div>
								<div class="col-3">
									<label for="lastName">Last Name:</label>
									<br>
									<input class="babylastname" type="text" name="lastName" value="${babyLastName}" disabled>
								</div>
								<div class="col-3">
									<label for="sex"> Sex:</label>
									<br>
									<select class="babygender" name="sex" disabled>
									    <option value="male">Male</option>
									    <option value="female">Female</option>
	  								</select>
								</div>
							</div>

							<div class="row">
								
								<div class="col-3">
									<label for="dateOfBirth">Date of Birth:</label>
									<br>
									<input class="dateofbirth" type="date" name="dateOfBirth" value="${dateOfBirth}" disabled>
								</div>
								<div class="col-3">
									<label for="birthLength">birth length:</label>
									<br>
									<input class="birthlength" type="text" name="birthLength" value="${birthLength}" disabled>
								</div>
								<div class="col-3">
									<label for="birthCity">Birth city:</label>
									<br>
									<input class="birthCity" type="text" name="birthCity" value="${birthCity}" disabled>
								</div>
								<div class="col-3">
									<label for="birthWeight">birth weight:</label>
									<br>
									<input class="birthweight" type="text" name="birthWeight" value="${birthWeight}" disabled>
								</div>
							</div>

							<h3>Parents</h3>
							
							<div class="row">
								<h4>Mother</h4>
								<div class="col-4">
									<label type="motherFirstName">First Name:</label>
									<br>
									<input class="motherfirstname" type="text" name="motherFirstName" value="${motherFirstName}" disabled>
								</div>
								<div class="col-4">
									<label for="motherMiddleName">Middle Name:</label>
									<br>
									<input class="mothermiddlename" type="text" name="motherMiddleName" value="${motherMiddleName}" disabled>
								</div>
								<div class="col-4">
									<label for="motherLastName">Last Name:</label>
									<br>
									<input class="motherlastname" type="text" name="motherLastName" value="${motherLastName}" disabled>
								</div>
							</div>
							
							
							<div class="row">
								<h4>Father</h4>
								<div class="col-4">
									<label type="fatherFirstName">First Name:</label>
									<br>
									<input class="fatherfirstname" type="text" name="fatherFirstName" value="${fatherFirstName}" disabled>
								</div>
								<div class="col-4">
									<label for="fatherMiddleName">Middle Name:</label>
									<br>
									<input class="fathermiddlename" type="text" name="fatherMiddleName" value="${fatherMiddleName}" disabled>
								</div>
								<div class="col-4">
									<label for="fatherLastName">Last Name:</label>
									<br>
									<input class="fatherlastname" type="text" name="fatherLastName" value="${fatherLastName}" disabled>
								</div>
							</div>
							<div class="">
								<input class="btn nutrbtn" type="button" value="Edit">
								<input class="btn posbtn" type="submit" value="Submit" disabled>
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
				<div class="milebtn"><button class="view-dec btn">More</button></div>
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

	return `<form id="${id}" class="mileinput modal-content">
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

//this function submits and edit to the milestone post
$('.mile-edit').on('click', '.posbtn', function(e){
	e.preventDefault();
	let editItemId = $(this).closest('.mile-edit').find('form').attr('id');
	let date = $(this).closest('.mile-edit').find('.miledate-edit').val();
	let title = $(this).closest('.mile-edit').find('.miletitle-edit').val();
	let desc = $(this).closest('.mile-edit').find('.miledescription-edit').val();
	console.log(desc);
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
	$(this).closest('.modal').fadeOut();
	$(this).closest('.modal').empty();
	getAllMilestones();
});

///
$('.babyview-edit').on('click',function() {
	$('.baby-edit').fadeIn();
})

//this expands and retracts the milestone info
$('.milestonelist').on('click', '.view-dec', function() {
	$(this).closest('.fullstone').find('.milehidden').toggleClass('hidden');
});


//if a x is clicked on a modal it will close and the modal will empty
$('.modal').on('click', '.closebtn', function() {
	$(this).closest('.modal').fadeOut();
	// $(this).closest('.modal').empty();
});



function runMilestone() {
	getBabyInputs();
	postMilestone();
	getAllMilestones();
}

$(runMilestone());
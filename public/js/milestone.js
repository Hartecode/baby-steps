'use strick';

const babyId = localStorage.getItem('babyId');

let listOfMilestones;

console.log(babyId);

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


//this expands and retracts the milestone info
$('.milestonelist').on('click', '.view-dec', function() {
	$(this).closest('.fullstone').find('.milehidden').toggleClass('hidden');
});


//if a x is clicked on a modal it will close and the modal will empty
$('.modal').on('click', '.closebtn', function() {
	$(this).closest('.modal').fadeOut();
	$(this).closest('.modal').empty();
});



function runMilestone() {
	postMilestone();
	getAllMilestones();
}

$(runMilestone());
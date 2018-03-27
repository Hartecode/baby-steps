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
	$.getJSON(`/api/users/milestone/${babyId}`, function(data) {
		listOfMilestones = data.map(obj => {
			return milestoneHTML(obj);
		});
		$('.milestonelist').html(listOfMilestones);
	});
}

//tis functoon is the html for the milestones
function milestoneHTML(obj) {
	let stoneId = obj.id;
	let stoneDate = obj.date;
	let stoneTitle = obj.title;
	let stoneDec = obj.description;
	return `<div id="${stoneId}" class="fullstone">
				<div class="milestonedate">${stoneDate}</div>
				<div class="milestonetitle">${stoneTitle}</div>
				<div class="milehidden">
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
            error: error => console.log(error)
        });
	getAllMilestones();
});

function runMilestone() {
	postMilestone();
	getAllMilestones();
}

$(runMilestone());
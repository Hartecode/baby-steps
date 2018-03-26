'use strick';

const babyId = localStorage.getItem('babyId');

console.log(babyId);

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
	});
}

function clearInputs() {
	$('.miledate').val('');
	$('.miletitle').val('');
	$('.miledescription').val('');
}

function runMilestone() {
	postMilestone();
}

$(runMilestone());
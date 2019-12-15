var today = moment().format("MMMM Do YYYY");
var viewing;
var lengthofday = 9;
var startTime = 9;

function initializeDay (day) {
    //set which day you are viewing
    viewing = day;
    //add date at top of page
    $("#currentDay").text(day);
    //get events already entered from local storage
    var calendar = [];
    if (localStorage.getItem(day)){
      calendar = JSON.parse(localStorage.getItem(day));
      console.log("initialize day calendar: " + calendar)
    }
    //get current time

    //create time blocks
    for (var i = 0; i < lengthofday; i++){
      dispTime = startTime + i;
      
      var group = $("<div>").attr("class", "input-group input-group-lg mb-2"); ;
      $("#timeblocks").append(group);

      var showTime = $("<div>").attr("class", "input-group-prepend");
      group.append(showTime);
      var thisTime = $("<span>");
      thisTime.attr("id", "inputGroup-sizing-lg");
      thisTime.text(dispTime + ":00");
      showTime.append(thisTime);

      var eventInput = $("<input>").attr("type", "text");
      eventInput.attr("class", "form-control");
      eventInput.attr("id", "event" + dispTime);
      if (calendar[i]){
        eventInput.attr("value", calendar[i]);
      }
      eventInput.attr("aria-label", "Large");
      eventInput.attr("aria-describedby", "inputGroup-sizing-sm");
      group.append(eventInput);

      var btnDiv = $("<div>").attr("class", "input-group-append");
      group.append(btnDiv);
      var sBtn = $("<button>");
      sBtn.attr("type", "button");
      sBtn.attr("id", ("sBtn" + dispTime));
      sBtn.attr("value", dispTime);
      sBtn.text("Save");
      btnDiv.append(sBtn);

      //format based on past, present or future
      if (dispTime <= 9){
        dispTime = "0" + dispTime;
      }
      var formDay = day + " " + dispTime;

      if (moment(formDay, "MMM Do YYYY HH").isBefore(moment(), 'hour')){
        thisTime.attr("class", "input-group-text");
        eventInput.attr("class", "form-control past");
        sBtn.attr("class", "btn btn-outline-secondary");
      }
      else if (moment(formDay, "MMM Do YYYY HH").isSame(moment(), 'hour')){
        thisTime.attr("class", "input-group-text present");
        eventInput.attr("class", "form-control present");
        sBtn.attr("class", "btn btn-outline-primary");
      }
      else {
        thisTime.attr("class", "input-group-text future");
        eventInput.attr("class", "form-control");
        sBtn.attr("class", "btn btn-outline-primary");
      }


      $("#sBtn" + dispTime).on("click", function () {
        updateLocalStorage(day, $(this).attr("value"), $(this).parent().parent().find("input").val())
      });

    }

}

function updateLocalStorage(day, time, event) {
  var newDay = [];
  //loop through the events currently on the page to create an array
  for (var i = 0; i < lengthofday; i++){
    var getTime = startTime + i;
    var getEvent = $("#event" + getTime).val();
    newDay[i] = getEvent;
  }
  
  //set localstorage
  console.log("saving array: " + newDay);
  localStorage.setItem(day, JSON.stringify(newDay));
}

function clearDay (){
  //clear out all of the events
  $("#timeblocks").empty();
}

//go back one day from the day currently shown
$("#yesterday").on("click", function () {
  var yest = moment(viewing, "MMMM Do YYYY").subtract(1, "day").format("MMMM Do YYYY");
  updateLocalStorage(viewing);
  clearDay();
  initializeDay(yest);
});

//go forward one day from the day currently shown
$("#tomorrow").on("click", function () {
  var tom = moment(viewing, "MMMM Do YYYY").add(1, "day").format("MMMM Do YYYY");
  updateLocalStorage(viewing);
  clearDay();
  initializeDay(tom);
});


initializeDay(today);
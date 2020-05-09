// to create a task object i have to pass in to the task listView needed to create the task list object
// this data are ---> the first one the title of the task that i can get from the input field
// and the second necessery thing is the post request which is (CSRF_TOKEN) other wise django will raise eception yuou will get 403
// there are many ways to use csrf_token but the easyst way is to use seralizer -> for this reason i have to identfy the html form
// for this porpose it is convinet to add (id) to the form

var csrfToken = $("input[name=csrfmiddlewaretoken]").val();

$(document).ready(function () {
  $("#createButton").click(function () {
    // in the body of this function i need to get the serialized data of the form
    // and then i need to get the form by it's ID
    var serializedData = $("#createTaskForm").serialize();
    // in the first line bellow if you see in console you can see the csrf and it's value so wee need to pass it to the django
    // for this resone we gnna use ajax
    // console.log(serializedData)

    $.ajax({
      // in the url you can use hard coded url as well but i gnna use the best way
      url: $("createTaskForm").data("url"),
      data: serializedData,
      type: "post",
      // success is when we get the response from the django
      // so i wanted to inject the new card layout of the title of the newly created task
      // so fiirst of all i need to indentify some how the dive that contain all task cards
      success: function (response) {
        $("#taskList").append(
          '<div class="card mb-1" id="taskCard" data-id="' +
            response.task.id +
            '"><div class="card-body">' +
            response.task.title +
            '<button type="button" class="close float-right" data-id="' +
            response.task.id +
            '"><span aria-hidden="true">&times;</span></button></div></div>'
        );
      },
    });

    // if you you want to automaticly reset the input field after you submited so do this
    $("#createTaskForm")[0].reset();
  });
  // the next one is almost the same but this time i hahve to click on specipic card and i have to get
  //   it's id and sended to django ----> the main problem here is the newly created card is dynamicly created card
  //   have the on click handeler buut how do they can get it but javascript is loaded only once at the page
  //   and to solve thsi problem we use here the event deligation mecanism and it's look like this
  // so first of all i'm geting the parent container of all task cards
  //   and the second argument is HTML element which the click ocured (.card)
  $("#taskList")
    .on("click", ".card", function () {
      var dataId = $(this).data("id");

      $.ajax({
        url: dataId + "/completed/",
        data: {
          csrfmiddlewaretoken: csrfToken,
          id: dataId,
        },
        type: "post",
        success: function () {
          var cardItem = $('#taskCard[data-id="' + dataId + '"]');
          cardItem.css("text-decoration", "line-through").hide().slideDown();
          $("#taskList").append(cardItem);
        },
      });
    })
    .on("click", "button.close", function (event) {
      // the deleting of an object is almost the same as previous one but htere is only one isue
      //  i wanted to delete only one object by clicking on the button the cross(x) placed on teh (card div)
      // how to diffrentiate that the click was on the cross button (x) but not on the entire card
      // it's importnt here because the clicking on teh card has a diffrent behavior it's diffrent even
      // the even argument is the object of the event that happend due to user actions which this even genrated by browser
      // in here we can use (stopPropagation) method, it means that if the user click on the cross button (x)
      // it dosn't expand this event to it's parent element and the click remain the cross button only
      event.stopPropagation();

      var dataId = $(this).data("id");

      $.ajax({
        url: dataId + "/delete/",
        data: {
          csrfmiddlewaretoken: csrfToken,
          id: dataId,
        },
        type: "post",
        dataType: "json",
        success: function () {
          $('#taskCard[data-id="' + dataId + '"]').remove();
        },
      });
    });
});

var screenState;

function onLoad() {

    $(window).resize(onResize);

    onResize();

}

function onResize() {
    // If the Screenstate has changed
    if (screenState != getScreenType()) {
        // Store the new Screenstate
        newScreenState = getScreenType();
        console.log(newScreenState);

        // If the newScreenstate is Large or Medium, and the Old state wasn't large or Medium
        if (((newScreenState == 'lg') || (newScreenState == 'md')) && !((screenState == 'lg') || (screenState == 'md'))) {

            // Set some CSS (due to changes when using sm or xs screenStates)
            $("#mainBody").css('top', 0);
            $("#navSide").css('top', 0);
            // Ensure the Primary Sidebar is visible, and that all collapsible navigation boxes are collapsed.
            $("#navSide").collapse("show");
            $(".navCollapse").collapse("hide");

            // Restore Max-Height of Sidebar to 100%
            $('#navSide').css('max-height', "100%");
        }
        // if the newScreenstate is small or extra-small, and was neither prior
        else if (((newScreenState == 'sm') || (newScreenState == 'xs')) && !((screenState == 'sm') || (screenState == 'xs'))) {

            // Collapse the Sidebar 
            $("#navSide").collapse("hide");

        }

        // Store the current ScreenState and the new ScreenState
        screenState = newScreenState;
    }

    // If the screenState is small or extra-small
    if ((screenState == 'sm') || (screenState == 'xs')) {

        //TODO: Remove this Code, if no issues arrise when testing on Mobile.
        // Scale the NavBar's MIT Logo to be equal in height to the Burger Button.
        //$("#navBarLogo img").css('height', $('#navBarBurger i').css('height'));
        // Move the Top of the Sidebar to be below the Navbar (Which has a dynamic height)
        $("#navSide").css('top', $("#navBar").css('height'));
        // Move the Max-Height to prevent overflow past screen edge.
        $('#navSide').css('max-height', $(window).innerHeight() - parseInt($("#navBar").css('height')) + "px");
        // Move the Top of the Page's Mainbody below the Navbar (Which has a dynamic height)
        $("#mainBody").css('top', $("#navBar").css('height'));

    }

    // Dynamically set the Width and Height attributes of the Canvas element (Seperate from their spatial Width and height)
    // to their actual Width and Height.
    if (($("#inputSignatureCanvas canvas").attr('height') != $("#inputSignatureCanvas canvas").css('height')) || ($("#inputSignatureCanvas canvas").attr('width') != $("#inputSignatureCanvas canvas").css('width'))) {
        $("#inputSignatureCanvas canvas").attr('height', $("#inputSignatureCanvas canvas").css('height'));
        $("#inputSignatureCanvas canvas").attr('width', $("#inputSignatureCanvas canvas").css('width'));
    }
}

function getScreenType() {
    // Returns the Current Bootstrap ScreenType based on the Window's InnerWidth.
    // Because I couldn't find a simple way to do this with Bootstrap itself.
    var w = window.innerWidth;

    if (w < 768) {

        return 'xs';

    } else if (w < 992) {

        return 'sm';

    } else if (w < 1200) {

        return 'md';

    } else {

        return 'lg';

    }

}

function retrieveMinutes() {
    // Using the minutes.json file provided on the Server,
    // generate the HTML Layout listing each Meeting that has occured
    // with a link to download their minutes.

    // It is planned that this functionality will be replaced with a Server-side solution sometime in Q3.

    var minutesContainer = $("#minutesContainer");
    $.getJSON("files/minutes/minutes.json", function (data) {

        // Each Year
        $.each(data, function (year, val) {
            minutesContainer.append($("<h3>" + year + "</h3>"));

            // Each Month
            $.each(val, function (month, val) {

                // Create a speciality div to store this Month's Minutes
                var minute = $("<div class='minutesBlock col-lg-6 col-md-8 col-sm-12 col-xs-12'></div>");

                // A Simple Title
                minute.append($("<h4 class='col-lg-12'>" + month + "</h4>"));

                // Frame up the List for each field and value
                var descList = $("<dl class=\"dl-horizontal\"></dl>");

                $.each(val, function (field, value) {

                    // Each minute value in the JSON should have this field - to show which downloads are available.
                    // Format will always be a list.
                    if (field == "formats") {

                        descList.append($("<dt>Downloads</dt>"));

                        // If no file formats are listed
                        if (value.length == 0) {

                            descList.append($("<dd>No Downloads Available</dd>"));

                        }
                        else {

                            // Create a Description for each format in the list, ordered alphabetically.
                            var desc = $('<dd></dd>');
                            $.each(value.sort(), function (index, value) {

                                desc.append($("<a href=" + ("files/minutes/" + encodeURIComponent(year) + "/" + encodeURIComponent(month) + "/" + encodeURIComponent(month) + "%20" + encodeURIComponent(year + ' ').substring(0, year.indexOf(' ')) + "%20Minutes." + value) + ">" + value.toUpperCase() + "</a>"));
                                desc.append("&nbsp;");

                            });
                            descList.append(desc);

                        }
                    }
                    // For fields other than the Formats.
                    else {

                        descList.append($("<dt>" + field + "</dt>"));

                        // If this is a 'Time' field, create the Date value and format accordingly.
                        if (field.toLowerCase().includes("time")) {

                            var time = new Date(value);
                            descList.append($("<dd>" + time.toLocaleTimeString() + " - " + time.toDateString() + "</dd>"));

                        }

                        // If this is a more generic, extra field then just print the value.
                        else {
                            descList.append($("<dd>" + value + "</dd>"));
                        }
                    }
                });
                minute.append(descList);
                minutesContainer.append(minute);
            });

        });
    });
}

function retrieveMembers() {
    // Similarly to retrieveMinutes (Starting Line 85)
    // This function uses the members.json provided on the server
    // to generate a list of the Current and Former members of the Student Council.

    // Server-side replacement is also desired. This may be produced during Q3.

    var membersContainer = $("#membersContainer");
    $.getJSON("files/whoAreWe/members.json", function (data) {
        // Each Year
        $.each(data, function (year, val) {
            membersContainer.append($("<h3>" + year + "</h3>"));
            // Each Month
            $.each(val, function (index, member) {
                // Create a speciality div to store this Member's Details
                var memberBlock = $("<div class='memberBlock col-lg-4 col-md-6 col-sm-6 col-xs-12'></div>");
                // A Simple Title
                memberBlock.append($("<img src='files/whoAreWe/images/" + member.Image + "' />"));
                memberBlock.append($("<h4 class='col-lg-12'>" + member.Name + "</h4>"));
                // Frame up the List for each field and value
                var descList = $("<dl></dl>");


                // Member's Titles
                descList.append($("<dt>Titles:</dt>"));
                if (member['Titles'].length == 0) {
                    descList.append($("<dd>No Titles</dd>"));
                }
                else {
                    // Create a Description for each title in the list.
                    $.each(member.Titles, function (index, title) {
                        var desc = ($("<dd>" + title + "</dd>"));
                        descList.append(desc);
                    });

                }

                // Member's Term
                if (member.Term != undefined) {
                    descList.append($("<dt>Term:</dt>"));
                    descList.append($("<dd>" + member.Term.Start + " - " + member.Term.End + "</dd>"));
                }

                // Member's Contact Details
                descList.append($("<dt>Contact:</dt>"));
                $.each(member['Contact'], function (type, value) {
                    if (type == "Email") {
                        // Mailto Link for Emails
                        descList.append($("<dd>" + type + " : <a target='_blank' href='mailto:" + value + "'>" + value + "</a></dd>"));
                    }
                    else if (type == "LinkedIn") {
                        // Format LinkedIn links - Use Regex to extract just the ID from the URL, and use that as display name for Anchor.
                        descList.append($("<dd>" + type + " : <a target='_blank' href='" + value + "'>" + value.match("https:\/\/www\.linkedin\.com\/in\/(.*)\/")[1] + "</a></dd>"));
                    }
                    else {
                        // Generic Field Entry
                        descList.append($("<dd>" + type + " : " + value + "</dd>"));
                    }
                });
                memberBlock.append(descList);
                membersContainer.append(memberBlock);
            });

        });
    });
}

function contactMembersList(element, select) {

    // Similar to retrieveMinutes and retrieveMembers, to a shorter degree.
    // This function takes the members.json provided for the Members page, and collates the First Year in the list's (the most recent)
    // Members and each of their Title & Email Address.

    // This function will be called for both the Recipient box and the Carbon-Copy box.

    // At with the other uses for these json files, a Serverside solution would be more ideal.

    $.getJSON("files/whoAreWe/members.json", function (data) {
        // For the Most Current Year, return each member
        $.each(data[Object.keys(data)[0]], function (index, member) {
            $(element).append($("<option data-subtext='" + member.Titles[0] + "'value='" + member.Contact.Email + "'>" + member.Name + "</option>"))
        });
    })

    // Experienced issues with Timing when telling the select to refresh too soon.
    // With Serverside / Hardcoded options, this wouldn't be necessary. But alas...
    setTimeout(function () { $(select).selectpicker('refresh'); }, 1000);

}

//Look into better way of handling Reusable code. Client-Side XSS is a terrible idea.
function sharedResource(element, resource) {
    // Takes the requested Dummy element, and replaces it with the content recieved at the requested shared URL.

    // This is poor practice, and would be better suited in a Server-Side manner.

    var ele = $(element);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "shared/" + resource, false);
    xmlhttp.send();
    ele[0].outerHTML = xmlhttp.responseText;

}

// Contact Form Validation/Processing
function formProcess(element) {
    // Validation for the Form is handled through the use of Required and Type attributes, and the conventional
    // handling they provide.
    // I have also used the Pattern attribute in the Phone Number and Name 

    element = $(element)[0];
    

    // Mail Test
    // The original plan for this contact form, while no Serverside method was available,
    // was to construct a mailto: link, using the selected Recipients, CarbonCopy, etc.
    // This works perfectly, excluding the Signature (seel below).

    // Once again, the HTML5 Canvas element finds a way to make things harder than they have to be.

    // For the Mailto link, all the fields have to be encoded to a URI Compatible format, due to special characters.

    var name = encodeURI(element.inputStudentName.value);

    var mailto = "mailto:" + encodeURI(element.inputRecipient.value) + "?subject=Student%20Council%20-%20Correspondence%20from%20" + name;

    var carbonCopy = encodeURI($(element.inputCC).val().join(","));
    if (carbonCopy.length != 0) {
        mailto += "&cc=" + carbonCopy;
    }

    var messageBody = encodeURI(element.inputMessage.value) + "%0A%0A";

    /*

    The Length of the Signature Data takes the mailto URI too high.
    If dealing with a Serverside database to store the messages, this wouldn't be an issue.

    A Potential solution in the future could be to have the client upload the image data to a service like Puush.
    For now, It'll remain commented below.
    */

    /*
    var signature = element.inputStudentSignature.value;
    if (signature.length > 0) {
        messageBody += encodeURI("<img src='" + signature + "' />") + "%0A";
    }
    */

    messageBody += name + "%0A";
    messageBody += encodeURI("Email: " + element.inputStudentEmail.value) + "%0A";

    if (element.inputStudentPhone.value.length > 0) {
        messageBody += encodeURI("Phone: " + element.inputStudentPhone.value);
    }

    mailto += "&body=" + messageBody;

    // As it's simpler to test, and less prone for abuse without adding Recaptcha functionality (or similar), just log the completed link to the console for now.
    console.log(mailto);
    element.action = mailto
    return true;
}
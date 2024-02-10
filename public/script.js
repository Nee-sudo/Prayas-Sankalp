// 

  // Function to submit the registration form
  function submitRegistration(event) {
    event.preventDefault(); // Prevent the default form submission

    // Your existing code to collect form data
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var birthdayDate = document.getElementById('birthdayDate').value;
    var genderOptions = document.getElementsByName('inlineRadioOptions');
    var gender;
    for (var i = 0; i < genderOptions.length; i++) {
      if (genderOptions[i].checked) {
        gender = genderOptions[i].value;
        break;
      }
    }
    var emailAddress = document.getElementById('emailAddress').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    var selectedOption = document.querySelector('.select').value;

    // You can use the Fetch API or another method to send the data to the server
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        birthdayDate: birthdayDate,
        gender: gender,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        selectedOption: selectedOption,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      // Optionally, close the signup overlay or perform other actions
      closeSignupOverlay();
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    });
  }


//   function for opening and closing the form
  // Function to open the signup overlay
  function openSignupOverlay() {
    document.getElementById("signupOverlay").style.display = 'block';
  }

  // Function to close the signup overlay
  function closeSignupOverlay() {
    document.getElementById("signupOverlay").style.display = 'none';
  }

  // Function to open the login overlay
  function openLoginOverlay() {
    document.getElementById("loginOverlay").style.display = 'block';
  }

  // Function to close the login overlay
  function closeLoginOverlay() {
    document.getElementById("loginOverlay").style.display = 'none';
  }
  

  // to display

    function fetchAndDisplayPosts() {
      // Fetch posts from your server
      fetch('http://localhost:3000/getPosts')
        .then(response => {
          // Check if the response is successful (status code 200)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(posts => {
          // Display the fetched posts
          displayPosts(posts);
        })
        .catch(error => console.error('Error fetching posts:', error));
    }

    function displayPosts(posts) {
      // Clear existing posts
      document.getElementById('postContainer').innerHTML = '';

      // Iterate over the fetched posts and display them
      posts.forEach(post => {
        displayPost(post);
      });
    }

    function displayPost(postData) {
      var postElement = document.createElement('div');
      postElement.classList.add('box');

      postElement.innerHTML = `
        <h2>${postData.title}</h2>
        <div>${postData.content}</div>
      `;
        // Add onclick event
      postElement.onclick = function() {
        togglepost(this);
    };
  

      document.getElementById('postContainer').appendChild(postElement);
    }

    document.addEventListener('DOMContentLoaded', function () {
      // Fetch and display posts when the page loads
      fetchAndDisplayPosts();
    });


    function togglepost(post){
      post.classList.toggle('expanded');
    }

  
  
const t = '\t',
      n = '\n';

// PDF Object
// const PDFObject = require('pdfobject');
// PDFObject.embed("/doks/prologue/Deduplication_Process.pdf", "#de-duplication"); // API findings 
// PDFObject.embed("/doks/prologue/Getting_Started.pdf", "#getting-started-pdf"); // API findings OAuth_Authorization_Guide.pdf
// PDFObject.embed("/doks/prologue/OAuth_Authorization_Guide.pdf", "#oauth-instructionset");

// Text Transformation for Alerts
function capitalize(text) {
    return text.replace(/\b\w/g , function(m){ return m.toUpperCase(); } );
  }
  
  // Form Validations
  var validations = {
    required: function(value){
      return value !== '';
    },
    phone: function(value){
      return value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  );
    },
    email: function(value){
      return value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
  }
  function validate() {
    var form = document.getElementById('jsForm'),
        postmail = document.getElementById('postmail'),
        inputsArr = form.querySelectorAll('input'),
        subjectChosen = form.querySelector('#subject'),
        textArr = form.querySelectorAll('textarea'),
        errorMessage = document.querySelector(".error"),
        successMessage = document.querySelector(".success");
    
  // send postmail
    // contents for the request
    var subjectContents = document.querySelector("[name='subjects']").value,
    subjectStaple = encodeURIComponent("Anonymous Form Submission on Wiki: "),
    commentsContents = encodeURIComponent(document.querySelector("[name='comments']").value),
    texpToken = "kc4rdpwqn6uwcvrzkvxmqpzc",
    batmanToken = "5cwzhcoce1l0o87xn7mi3o0w";
  
    /* mini gravesite
    //subjectURL = `subject=${encodeURIComponent(subjectContents)}`,
    //commentsURL = `&text=${encodeURIComponent(commentsContents)}`,
    //akt = `&access_token=kc4rdpwqn6uwcvrzkvxmqpzc`;
    // content2Send = `https://postmail.invotes.com/send?${subjectURL}${commentsURL}${akt}`;
    // anatomy of the request */
  
  var xhr = new XMLHttpRequest(),
    //url = "https://postmail.invotes.com/send?",
    simple = `subject=${subjectStaple}${subjectContents}&text=${commentsContents}&access_token=${batmanToken}`;
    //data = `${subjectURL}${commentsURL}${akt}`;
    function sendPostmail() {
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
          if(this.readyState === 4) {
            console.log('ready state:', this.readyState); // should be 4
            console.log('status:', this.status); // should be 200 OK
            console.log('response:', this.responseText); // response return from request
          }
        });
  
        xhr.open("POST", "https://postmail.invotes.com/send?");
        xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
        xhr.send(simple);
        
        // printing output/send
        console.log(xhr.status, simple);
    }
    
    // emoji's for pulse check
    document.querySelectorAll('.feedback li').forEach(entry => entry.addEventListener('click', e => {
      if(!entry.classList.contains('active')) {
          document.querySelector('.feedback li.active').classList.remove('active');
          entry.classList.add('active');
      }
      e.preventDefault();
    }));
  
    // math quiz
    function mathQuiz() {
      var mathProof= document.querySelector('#mathProof'),
      mathResults = document.querySelector('.mathResults'),
      success = "NICE! Now you can send! 🎉<br/>",
      failure = "WRONG! You're either a robot, or to bad at math to be anonymous... 😂<br/>",
      tryAgain = "Not Quite... Maybe try again? 🧮<br/>",
      minimum = 1,
      maximum = 10,
      int1 = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum,
      int2 = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  
      document.getElementById('question').innerHTML = int1 + " " + "+" + " " + int2;
      var qanswer = int1 + int2;
      
      mathProof.addEventListener('click', function(e){
        var uanswer = document.getElementById('answer').value;
        if (uanswer == qanswer) {
          mathResults.innerHTML = success;
          console.log(success);
        } else if(uanswer == qanswer-3 || uanswer == qanswer+3 || uanswer == qanswer-2 || uanswer == qanswer+2 || uanswer == qanswer-1 || uanswer == qanswer+1) {
          mathResults.innerHTML = tryAgain;
          console.log(tryAgain);
        } else {
          mathResults.innerHTML = failure;
          console.log(failure); 
        }
        e.preventDefault();
      }, false);
    };
  
    mathQuiz();
  
    // reload all values
    function clear() {
      var clearEyes = document.querySelectorAll('.clearEye');
      clearEyes.forEach(element => element.value="");
      document.cookie = 'COOKIE_NAME=; Max-Age=0; path=/; domain=' + location.hostname;
      console.log('things to clear:', clearEyes);
    }
    
    postmail.addEventListener('click', function(e){
      // captcha required
      var h = 0,
          attr = textArr[h].getAttribute('data-validation'),
          rules = attr ? attr.split(' ') : '';
          checkMath = document.querySelector('#jsForm > span.mathResults'),
          answerContents = checkMath.innerHTML.toString();
      if(answerContents.includes("WRONG!") || answerContents.includes("Not Quite...") || answerContents == "" || answerContents == null) {
        e.preventDefault();
        console.log("Math failed");
        errorMessage.className = "error";
        errorMessage.innerHTML = "⚠️&nbsp;Invalid!&nbsp;⚠️" + "<br/>\"" + capitalize('captcha') + "\" is " + rules[h];
        return false;
      } else {
        console.log('Math passed');
      }
      // subject selection required
      var i = 0,
          attr = textArr[i].getAttribute('data-validation'),
          rules = attr ? attr.split(' ') : '';
      if(subjectChosen.value == "" || subjectChosen.value == null) {
        e.preventDefault();
        console.log("no subject selected");
        errorMessage.className = "error";
        errorMessage.innerHTML = "⚠️&nbsp;Invalid!&nbsp;⚠️" + "<br/>\"" + capitalize(subjectChosen.name) + "\" is " + rules[i];
        return false;
      } else { console.log(subjectChosen.value); }
      // comments required
      while (i < textArr.length) {
        var j = 0,
            attr = textArr[i].getAttribute('data-validation'),
            rules = attr ? attr.split(' ') : '',
            parent = textArr[i].closest(".field");
        while (j < rules.length) {
          if(!validations[rules[j]](textArr[i].value)) {
            e.preventDefault();
            var errorField = textArr[i].name.toString();
            
            errorMessage.className = "error";
            errorMessage.innerHTML = "⚠️&nbsp;Invalid!&nbsp;⚠️" + "<br/>\"" + capitalize(errorField) + "\" is " + rules[j];
            parent.className = "field error";
            return false;
          }
          errorMessage.className = "error hidden";
          parent.className = "field";
          j++;
        }
        i++;
      }
      e.preventDefault();
      setTimeout(() => {sendPostmail(); }, 2000);
      console.log(postmail);
      var formHead = document.querySelector('.formHead'),
      textRepl = document.querySelector('div#text');
      textRepl.innerHTML = "";
      formHead.innerHTML = "Huzzah!&nbsp;🎉";
      successMessage.className = "success";
      form.outerHTML = "";
      delete form;
    }, false)
  }
  
  /** START ASYNC - LESS AWAIT, BUT WITH PROMISE */
  // Ensuring Only Fire on Correct Page
  function confirmPage() {
    const page = window.location.href,
        local = [page.includes('localhost:1818')],
        live = [
          page.includes('https://texp.wiki'), 
          page.includes('https://texp.netlify.app'),
          page.includes('https://total-expert.netlify.app'),
          page.includes('https://bvanilla.netlify.app')
        ],
        modals = [page.includes('/')],
        confirmPass = 'Contact script should be running 😎',
        confirmFail = 'Contact script should not be running 🧐';
    var result;
  
    function checkPage(arr, val) {
      return arr.some(function(arrVal) {
        return val === arrVal;
      });
    }
  
    const isLocal = checkPage(local, true),
        isLive = checkPage(live, true),
        isModal = checkPage(modals, true);
  
        if(isLocal & isModal) {
          // localhost/dev & correct modals page
          result = console.log('Page:', page, n, confirmPass),
          validate();
        } else if(isLocal & !isModal){
          // localhost/dev & NOT modals page
          result = console.log('Page:', page, n, confirmFail);
        } else if(isLive & isModal) {
          // live/prod & correct modals page
          result = console.log('Page:', page, n, confirmPass),
          // result = console.clear(),
          validate();
        } else {
          // live/prod & NOT modals page
          //result = console.clear();
          result = console.log('Page:', page, n, confirmFail);
        }
  }
  // run the function with appropriate result promised by confirmPage()
  async function correctPage() {return result}
  
  correctPage().then(
    function(value) {confirmPage(value);},
    function(error) {confirmPage(error);}
  );
  
  /** END ASYNC - LESS AWAIT, BUT WITH PROMISE */
  
  // TODO: add in feature for bypassing the 25 day rate limit on the postmail form submissions
  /* something like:
  if(xhr.responseText.includes("Daily Send Limit Exceeded (limit 25)")) {
    "access_token" : "secondary_token"
  }
  // but add in the option for this to be iterative over a few tokens
  */
  
  // TODO: add clear functionality intentionally on a clear button
  // TODO: extend the data included in the message to include time, location, browser information, and their selected emoji
  
  
  // Add this as an alternative with the body populated with the comments inputs
  // IF they select email at the bottom instead
  // window.open('mailto:kaska.miskolczi@totalexpert?subject=TEXP Anonymous&body=body');
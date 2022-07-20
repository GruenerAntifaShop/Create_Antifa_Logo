var JSON_IMAGES = {}
var JSON_CONFIG = {}
var NEW_IMAGES = 0
var POSITION_IMAGE = ["height", "width", "top", "left", "flip"]
var POSITION_TEXT = ["text", "size", "style", "top", "left", "bend", "flip", "color"]
document.getElementById("colorpicker_outer_circle").value = "#000000"
document.getElementById("colorpicker_inner_circle").value = "#ffffff"


/*
document.getElementById("colorpicker_text").value = "#ffffff"
document.getElementById("input_upper_text").value = "ANTIFASCHISTISCHE"
document.getElementById("input_down_text").value = "AKTION"
document.getElementById('upper_text').style.top = "0px";
document.getElementById('down_text').style.bottom = "0px";
circleType = new CircleType(document.getElementById('upper_text'));
circleType.radius(245).dir(1);
circleType = new CircleType(document.getElementById('down_text'));
circleType.radius(240).dir(-1);

*/
document.getElementById('image_picker').onchange = function(evt) {
  new_image = {
    "name": "",
    "files": [],
    "files_position": []
  }
  if (window.File && window.FileList && window.FileReader) {
    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {

      if (!files[i].type.match('image')) continue;

      var picReader = new FileReader();
      picReader.addEventListener("load", function(event) {
        var picFile = event.target;
        new_image["files"].push(picFile.result)
        new_image["files_position"].push([200, 230, 240, 65, 1])
      });
      //Read the image
      picReader.readAsDataURL(files[i]);
    }
    JSON_IMAGES.push(new_image)
    console.log(JSON_IMAGES)
    load_images()

  }
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //console.log(this.status)
    // Typical action to be performed when the document is ready:
    //console.log(xhttp.responseText);
    JSON_IMAGES = JSON.parse(xhttp.responseText)["images"]
    JSON_CONFIG = JSON.parse(xhttp.responseText)["config"]
    for (JSON_IMAGE_ID in JSON_IMAGES) {
      //console.log(value)
      load_mini_images(JSON_IMAGE_ID)
    }
    add_event_lister()
    set_data_image(JSON_CONFIG["first"])
  } else if (this.status == 404) {
    console.log(this.responseURL)
  }
};
xhttp.open("GET", "./images/images.json", true);
xhttp.withCredentials = true;
xhttp.send();

function load_mini_images(JSON_IMAGE_ID) {
  data = JSON_IMAGES[JSON_IMAGE_ID]
  if (document.getElementById("mini_images_div" + JSON_IMAGE_ID) == undefined) {
    elm = document.createElement("div")
    elm.classList.add("mini_images_div")
    elm.id = "mini_images_div" + JSON_IMAGE_ID
  } else {
    document.getElementById("mini_images_div" + JSON_IMAGE_ID).innerHTML = ""
    elm = document.getElementById("mini_images_div" + JSON_IMAGE_ID)
  }
  //console.log(json[value])
  for (image_id in data["files"]) {
    image = document.createElement("img")
    image.src = data["files"][image_id]
    image.classList.add("mini_images")
    image.style.height = data["files_position"][image_id][0] / 8 + "px"
    image.style.width = data["files_position"][image_id][1] / 8 + "px"
    image.style.top = data["files_position"][image_id][2] / 8 + "px"
    image.style.left = data["files_position"][image_id][3] / 8 + "px"
    image.style.transform = "scaleX(" + data["files_position"][image_id][4] + ")"
    image.style.position = "absolute"
    elm.appendChild(image)
  }
  elm.addEventListener("click", function(JSON_IMAGE_ID) {
    return function() {
      //console.log(value)
      set_data_image(JSON_IMAGE_ID)
    }
  }(JSON_IMAGE_ID))

  document.getElementById("mini_images_field").appendChild(elm)

}

function set_data_image(JSON_IMAGE_ID) {
  //console.log(JSON_IMAGE_ID)
  data = JSON_IMAGES[JSON_IMAGE_ID]
  //console.log(data)
  document.getElementById("circle_images").innerHTML = ""
  document.getElementById("controll_image_size").innerHTML = ""


  for (image_id in data["files"]) {
    //console.log(data["files_position"][image_id])
    image = document.createElement("img")
    image.src = data["files"][image_id]
    image.classList.add("max_images")
    image.style.height = data["files_position"][image_id][0] + "px"
    image.style.width = data["files_position"][image_id][1] + "px"
    image.style.top = data["files_position"][image_id][2] + "px"
    image.style.left = data["files_position"][image_id][3] + "px"
    image.style.transform = "scaleX(" + data["files_position"][image_id][4] + ")"
    //image.classList.add("")
    document.getElementById("circle_images").appendChild(image)
    for (position in POSITION_IMAGE) {
      //console.log(POSITION_IMAGE[position])
      label = document.createElement("label")
      label.innerHTML = POSITION_IMAGE[position] + " " + image_id
      input = document.createElement("input")
      input.id = POSITION_IMAGE[position] + image_id
      if (POSITION_IMAGE[position] == "flip") {
        input.type = "checkbox"
        if (data["files_position"][image_id][position] == "-1") {
          input.setAttribute("checked", "true")
        }
      }
      input.setAttribute("value", data["files_position"][image_id][position])

      label.appendChild(input)
      document.getElementById("controll_image_size").appendChild(label)
    }
    document.getElementById("controll_image_size").innerHTML += "<br>"
  }

  //addEventListener
  for (image_id in data["files"]) {
    for (position in POSITION_IMAGE) {
      document.getElementById(POSITION_IMAGE[position] + image_id).addEventListener("change", function(JSON_IMAGE_ID, image_id, position) {
        return function() {
          input = document.getElementById(POSITION_IMAGE[position] + image_id)
          //console.log(POSITION_IMAGE[position])
          if (POSITION_IMAGE[position] == "flip") {
            if (input.value == "1") {
              input.value = "-1"
            } else {
              input.value = "1"
            }
          }
          JSON_IMAGES[JSON_IMAGE_ID]["files_position"][image_id][position] = input.value
          //console.log(JSON_IMAGE_ID)
          load_mini_images(JSON_IMAGE_ID)
          set_data_image(JSON_IMAGE_ID)
        }
      }(JSON_IMAGE_ID, image_id, position))
    }
  }
  //LOAD TEXT IN BIG Image

  document.getElementById("image_field_text").innerHTML = ""
  document.getElementById("text_inputs").innerHTML = ""
  for (text_id in data["text"]) {
    //console.log(data["text"][text_id][0])
    //console.log(data["text"][text_id])
    text_div = document.createElement("div")


    text_div.innerHTML = data["text"][text_id][0]
    text_div.id = "image_field_text" + text_id
    text_div.classList.add("text_circle")
    text_div.style.fontSize = data["text"][text_id][1] + "px"
    text_div.style.fontWeight = data["text"][text_id][2]
    text_div.style.top = data["text"][text_id][3] + "px"
    text_div.style.left = data["text"][text_id][4] + "px"
    text_div.style.color = data["text"][text_id][7]
    document.getElementById("image_field_text").appendChild(text_div)

    circleType = new CircleType(document.getElementById("image_field_text" + text_id));
    circleType.radius(data["text"][text_id][5]).dir(data["text"][text_id][6]);

    input_div = document.createElement("div")
    label = document.createElement("label")

    //document.getElementById("text_inputs").innerHTML += "<br>"

    for (value in data["text"][text_id]) {
      label = document.createElement("label")
      label.innerHTML = POSITION_TEXT[value]
      input = document.createElement("input")
      input.id = "image_field_text" + POSITION_TEXT[value] + text_id
      if (POSITION_TEXT[value] == "color") {
        input.type = "color"
      }
      input.setAttribute("value", data["text"][text_id][value])
      label.appendChild(input)
      input_div.appendChild(label)
    }


    document.getElementById("text_inputs").appendChild(input_div)

    /*<input type = "text"id = "input_upper_text"value = "ANTIFASCHISTISCHE" > < input type = "color" id = "colorpicker_text" value = "#ffffff" > < br >*/
  }

  for (text_id in data["text"]) {
    for (position in POSITION_TEXT) {
      //console.log(POSITION_TEXT[position] + text_id)
      document.getElementById("image_field_text" + POSITION_TEXT[position] + text_id).addEventListener("change", function(JSON_IMAGE_ID, text_id, position) {
        return function() {
          input = document.getElementById("image_field_text" + POSITION_TEXT[position] + text_id)
          console.log(POSITION_TEXT[position], text_id, input.value)
          if (POSITION_TEXT[position] == "flip") {
            if (input.value == "1") {
              input.value = "-1"
            } else {
              input.value = "1"
            }
          }
          JSON_IMAGES[JSON_IMAGE_ID]["text"][text_id][position] = input.value
          //console.log(JSON_IMAGE_ID)
          load_mini_images(JSON_IMAGE_ID)
          set_data_image(JSON_IMAGE_ID)
        }
      }(JSON_IMAGE_ID, text_id, position))

    }
  }

}



function add_event_lister() {
  document.getElementById("colorpicker_outer_circle").addEventListener("input", function() {
    console.log(document.getElementById("colorpicker_outer_circle").value)
    document.getElementById("circle_out").style.background = document.getElementById("colorpicker_outer_circle").value
  });
  document.getElementById("colorpicker_inner_circle").addEventListener("input", function() {
    console.log(document.getElementById("colorpicker_inner_circle").value)
    document.getElementById("circle_in").style.background = document.getElementById("colorpicker_inner_circle").value
  });

  /*
  document.getElementById("reload_button").addEventListener("click", function() {
    load_images()
  });
	*/
  document.getElementById("download_button").addEventListener("click", function() {
    document.getElementById("image_field").style.borderStyle = "none"
    html2canvas(document.querySelector("#image_field"), {
      scale: 2
    }).then(canvas => {
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "html_image.jpg";
      link.href = canvas.toDataURL();
      link.target = '_blank';
      link.click();
      document.getElementById("image_field").style.borderStyle = "dotted"
    });
  });
}
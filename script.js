var JSON_IMAGES = {}
var JSON_CONFIG = {}
var NEW_IMAGES = 0
var position_struc = ["height", "width", "top", "left", "flip"]
document.getElementById("colorpicker_outer_circle").value = "#000000"
document.getElementById("colorpicker_inner_circle").value = "#ffffff"
document.getElementById("colorpicker_text").value = "#ffffff"
document.getElementById("input_upper_text").value = "ANTIFASCHISTISCHE"
document.getElementById("input_down_text").value = "AKTION"
document.getElementById('upper_text').style.top = "0px";
document.getElementById('down_text').style.bottom = "0px";
circleType = new CircleType(document.getElementById('upper_text'));
circleType.radius(245).dir(1);
circleType = new CircleType(document.getElementById('down_text'));
circleType.radius(240).dir(-1);


document.getElementById('image_picker').onchange = function(evt) {
  new_image = {
    "name": "",
    "files": [],
    "position": []
  }
  if (window.File && window.FileList && window.FileReader) {
    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {

      if (!files[i].type.match('image')) continue;

      var picReader = new FileReader();
      picReader.addEventListener("load", function(event) {
        var picFile = event.target;
        new_image["files"].push(picFile.result)
        new_image["position"].push([200, 230, 240, 65, 1])
      });
      //Read the image
      picReader.readAsDataURL(files[i]);
    }
    JSON_IMAGES.push(new_image)
    console.log(JSON_IMAGES)
    load_images()

  }
}

//  console.log(document.getElementById("upper_text").setAttribute("x" ,250-(document.getElementById("upper_text").getComputedTextLength()/2)))
//  console.log(document.getElementById("down_text").setAttribute("x" ,250-(document.getElementById("down_text").getComputedTextLength()/2)))
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //console.log(this.status)
    // Typical action to be performed when the document is ready:
    //console.log(xhttp.responseText);
    JSON_IMAGES = JSON.parse(xhttp.responseText)["images"]
    JSON_CONFIG = JSON.parse(xhttp.responseText)["config"]
    load_images()
    add_event_lister()
    set_data_image(JSON_IMAGES[JSON_CONFIG["first"]])
  } else if (this.status == 404) {
    console.log(this.responseURL)
  }
};
xhttp.open("GET", "./images/images.json", true);
xhttp.withCredentials = true;
xhttp.send();

function load_images() {
  console.log(JSON_IMAGES)
  document.getElementById("mini_images_field").innerHTML = ""
  for (value in JSON_IMAGES) {
    //console.log(json[value])
    elm = document.createElement("div")
    elm.classList.add("mini_images_div")
    for (image_id in JSON_IMAGES[value]["files"]) {
      image = document.createElement("img")
      image.src = JSON_IMAGES[value]["files"][image_id]
      image.classList.add("mini_images")
      image.style.height = JSON_IMAGES[value]["position"][image_id][0] / 8 + "px"
      image.style.width = JSON_IMAGES[value]["position"][image_id][1] / 8 + "px"
      image.style.top = JSON_IMAGES[value]["position"][image_id][2] / 8 + "px"
      image.style.left = JSON_IMAGES[value]["position"][image_id][3] / 8 + "px"
      image.style.transform = "scaleX(" + JSON_IMAGES[value]["position"][image_id][4] + ")"
      image.style.position = "absolute"
      elm.appendChild(image)
    }
    elm.addEventListener("click", function(value) {
      return function() {
        //console.log(value)
        set_data_image(JSON_IMAGES[value])
      }
    }(value))

    document.getElementById("mini_images_field").appendChild(elm)
  }
}

function set_data_image(data) {
  console.log(data)
  document.getElementById("circle_images").innerHTML = ""
  document.getElementById("controll_image_size").innerHTML = ""
  for (image_id in data["files"]) {

    //console.log(data["position"][image_id])
    image = document.createElement("img")
    image.src = data["files"][image_id]
    image.classList.add("max_images")
    image.style.height = data["position"][image_id][0] + "px"
    image.style.width = data["position"][image_id][1] + "px"
    image.style.top = data["position"][image_id][2] + "px"
    image.style.left = data["position"][image_id][3] + "px"
    image.style.transform = "scaleX(" + data["position"][image_id][4] + ")"
    //image.classList.add("")
    document.getElementById("circle_images").appendChild(image)
    for (position in position_struc) {
      //console.log(position_struc[position])

      label = document.createElement("label")
      label.innerHTML = position_struc[position] + " " + image_id
      input = document.createElement("input")
      input.id = position_struc[position] + image_id
      if (position_struc[position] == "flip") {
        input.type = "checkbox"
        if (data["position"][image_id][position] == "-1") {
          input.setAttribute("checked", "true")
        }
      } else {
        input.type = "number"

      }
      input.setAttribute("value", data["position"][image_id][position])
      label.appendChild(input)
      document.getElementById("controll_image_size").appendChild(label)
    }


    document.getElementById("controll_image_size").innerHTML += "<br>"
  }

  for (image_id in data["files"]) {
    position_struc[position]
    for (position in position_struc) {
      //console.log(position_struc[position] + image_id)
      document.getElementById(position_struc[position] + image_id).addEventListener("change", function(data, image_id, position) {
        return function() {
          if (position_struc[position] == "flip") {
            console.log("test")
            if (document.getElementById(position_struc[position] + image_id).value == "1") {
              document.getElementById(position_struc[position] + image_id).value = "-1"
            } else {
              document.getElementById(position_struc[position] + image_id).value = "1"
            }
          }
          data["position"][image_id][position] = document.getElementById(position_struc[position] + image_id).value
          console.log(data)
          load_images()
          set_data_image(data)
        }
      }(data, image_id, position))
    }
  }
}

function add_event_lister() {
  document.getElementById("input_upper_text").addEventListener("input", function() {
    document.getElementById("upper_text").innerHTML = document.getElementById("input_upper_text").value
    circleType = new CircleType(document.getElementById('upper_text'));
    circleType.radius(245).dir(1);
  });
  document.getElementById("input_down_text").addEventListener("input", function() {
    document.getElementById("down_text").innerHTML = document.getElementById("input_down_text").value
    circleType = new CircleType(document.getElementById('down_text'));
    circleType.radius(240).dir(-1);
  });
  document.getElementById("colorpicker_outer_circle").addEventListener("input", function() {
    console.log(document.getElementById("colorpicker_outer_circle").value)
    document.getElementById("circle_out").style.background = document.getElementById("colorpicker_outer_circle").value
  });
  document.getElementById("colorpicker_inner_circle").addEventListener("input", function() {
    console.log(document.getElementById("colorpicker_inner_circle").value)
    document.getElementById("circle_in").style.background = document.getElementById("colorpicker_inner_circle").value
  });
  document.getElementById("colorpicker_text").addEventListener("input", function() {
    console.log(document.getElementById("colorpicker_text").value)
    document.getElementById("upper_text").style.color = document.getElementById("colorpicker_text").value
    document.getElementById("down_text").style.color = document.getElementById("colorpicker_text").value
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
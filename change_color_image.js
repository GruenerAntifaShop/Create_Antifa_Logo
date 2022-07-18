if (document.getElementById("colorpicker_change_image") != null) {
  document.getElementById("colorpicker_change_image").value = "#ff0000"

  const canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d')
  const imgSrc = document.querySelector('input[type="file"]')

  let ORIGINAL_IMAGE_DATA

  const cacheImageData = () => {
    const original = context.getImageData(0, 0, canvas.width, canvas.height).data
    ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
    for (let i = 0; i < original.length; i += 1) {
      ORIGINAL_IMAGE_DATA[i] = original[i]
    }
  }

  const drawImage = img => {
    canvas.height = img.height
    canvas.width = img.width
    context.drawImage(img, 0, 0, img.width, img.height)
    cacheImageData()
  }

  const loadImage = e => {
    const img = new Image()
    img.src = e.target.result
    img.addEventListener('load', () => {
      drawImage(img)
    })
  }

  const detectImageInput = e => {
    const file = e.target.files[0],
      fr = new FileReader()
    if (!file.type.includes("image")) return
    fr.addEventListener('load', loadImage)
    fr.readAsDataURL(file)
  }
  imgSrc.addEventListener('change', detectImageInput)




  document.getElementById("colorpicker_change_image").addEventListener('change', () => {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    console.log(imgData.data)
    console.log(document.getElementById("colorpicker_change_image").value)
    color = convertColor(document.getElementById("colorpicker_change_image").value)
    console.log(color)
    console.log(imgData.data.length)
    for (let i = 0; i < imgData.data.length; i += 4) {
      //console.log(i)
      imgData.data[i] += color[0]
      imgData.data[i + 1] += color[1]
      imgData.data[i + 2] += color[2]
    }
    context.putImageData(imgData, 0, 0)
  })

  function convertColor(hexa) {
    /*https://idiallo.com/javascript/hex-to-dec-colors*/
    var chunks = [];
    var tmp, i;
    hexa = hexa.substr(1); // remove the pound
    if (hexa.length === 3) {
      tmp = hexa.split("");
      for (i = 0; i < 3; i++) {
        chunks.push(parseInt(tmp[i] + "" + tmp[i], 16));
      }
    } else if (hexa.length === 6) {
      tmp = hexa.match(/.{2}/g);
      for (i = 0; i < 3; i++) {
        chunks.push(parseInt(tmp[i], 16));
      }
    } else {
      throw new Error("'" + hexa + "' is not a valid hex format");
    }

    return chunks;
  }
}
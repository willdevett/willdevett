await WebMidi.enable();

let myInput = WebMidi.inputs[0];
let myOutput = WebMidi.outputs[0];

let dropIns = document.getElementById("dropdown-ins");
let dropOuts = document.getElementById("dropdown-outs");
let timeSlider = document.getElementById("time-slider");
let repeatsSlider = document.getElementById("repeats-slider");
let transpositionSlider = document.getElementById("transpo-slider");

WebMidi.inputs.forEach(function (input, num) {
  dropIns.innerHTML += `<option value=${num}>${input.name}</option>`;
});

WebMidi.outputs.forEach(function (output, num) {
  dropOuts.innerHTML += `<option value=${num}>${output.name}</option>`;
});

repeatsSlider.addEventListener("change", function () {
  console.log(repeatsSlider.value);
});
transpositionSlider.addEventListener("change", function () {
  console.log(transpositionSlider.value);
});

const transposition = function (midiIN, transpose) {
  let pitch = midiIN.note.number;

  pitch += transpose;

  let myNewNote = new Note(pitch, { rawAttack: midiIN.note.rawAttack });

  return myNewNote;
};

dropIns.addEventListener("change", function () {
  if (myInput.hasListener("noteon")) {
    myInput.removeListener("noteon");
  }
  if (myInput.hasListener("noteoff")) {
    myInput.removeListener("noteoff");
  }

  myInput = WebMidi.inputs[dropIns.value];

  myInput.addListener("noteon", function (someMIDI) {
    myOutput.sendNoteOn(
      transposition(someMIDI, parseInt(transpositionSlider.value))
    );
    setTimeout(function () {
      myOutput.sendNoteOn(
        transposition(someMIDI, parseInt(transpositionSlider.value))
      );
    }, 400 / parseInt(repeatsSlider.value));
    setTimeout(function () {
      myOutput.sendNoteOn(
        transposition(someMIDI, parseInt(transpositionSlider.value))
      );
    }, 800 / parseInt(repeatsSlider.value));
  });

  myInput.addListener("noteoff", function (someMIDI) {
    myOutput.sendNoteOff(
      transposition(someMIDI, parseInt(transpositionSlider.value))
    );
    setTimeout(function () {
      myOutput.sendNoteOff(
        transposition(someMIDI, parseInt(transpositionSlider.value))
      );
    }, 400 / parseInt(repeatsSlider.value));
    setTimeout(function () {
      myOutput.sendNoteOff(
        transposition(someMIDI, parseInt(transpositionSlider.value))
      );
    }, 800 / parseInt(repeatsSlider.value));
  });
});

dropOuts.addEventListener("change", function () {
  myOutput = WebMidi.outputs[dropOuts.value].channels[1];
});

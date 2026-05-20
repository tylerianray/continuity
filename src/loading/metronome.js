const METRONOME_STATES = [
  "arrow-up-right-circle-fill",
  "arrow-right-circle-fill",
  "arrow-down-right-circle-fill",
  "arrow-down-circle-fill",
  "arrow-down-left-circle-fill",
  "arrow-left-circle-fill",
  "arrow-up-left-circle-fill",
  "arrow-up-circle-fill"
];

let metroState = 0;
let metronome = setInterval(() => {
  if(metroState >= METRONOME_STATES.length) metroState = 0;
  set(METRONOME_STATES[metroState]);
  metroState++;
}, 250);

let i = $('#metronome');

function set(icon) {
  i.attr('class', `bi bi-${icon}`);
}

function stop() {
  clearInterval(metronome);
}

export { stop, set };

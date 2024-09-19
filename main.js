const torch = document.getElementById('torch');
const brightnessOverlay = document.getElementById('brightnessOverlay');
const colorPicker = document.getElementById('colorPicker');
const brightnessRange = document.getElementById('brightnessRange');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const footer = document.getElementById('footer');

let isTorchOn = false;

// Function to get luminance of a color (RGB to YIQ formula)
function getLuminance(color) {
  let r = parseInt(color.slice(1, 3), 16) / 255;
  let g = parseInt(color.slice(3, 5), 16) / 255;
  let b = parseInt(color.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Function to update text color based on luminance (light = black, dark = white)
function updateTextColor(color) {
  const luminance = getLuminance(color);
  if (luminance > 0.5) {
    // Light background, set text to black
    const buttons = document.querySelectorAll('.control-button, .form-control, .form-range');
    buttons.forEach(button => {
      button.style.color = '#000';
      button.style.borderColor = '#000';
      if (button.classList.contains('form-control')) {
        button.style.backgroundColor = '#fff';
      }
    });
  } else {
    // Dark background, set text to white
    const buttons = document.querySelectorAll('.control-button, .form-control, .form-range');
    buttons.forEach(button => {
      button.style.color = '#fff';
      button.style.borderColor = '#fff';
      if (button.classList.contains('form-control')) {
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      }
    });
  }
}

// Change the torch color and update button text color
colorPicker.addEventListener('input', function() {
  const chosenColor = colorPicker.value;
  torch.style.backgroundColor = chosenColor;
  updateTextColor(chosenColor);
});

// Adjust brightness using overlay
brightnessRange.addEventListener('input', function() {
  const brightnessValue = 1 - brightnessRange.value; // Inverse the value for dimming effect
  brightnessOverlay.style.backgroundColor = `rgba(0, 0, 0, ${brightnessValue})`;
});

// Toggle Fullscreen and Torch On/Off
fullscreenBtn.addEventListener('click', function() {
  if (!isTorchOn) {
    // Turn on torch (enter fullscreen and change button)
    document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = ' Turn Off Torch';
    fullscreenBtn.prepend(createIcon('fas fa-power-off')); // Change icon to power-off
    fullscreenBtn.classList.add('on');
    fullscreenBtn.classList.remove('off');
    footer.classList.add('hidden'); // Hide footer in fullscreen
    isTorchOn = true;
  } else {
    // Turn off torch (exit fullscreen and revert button)
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    fullscreenBtn.textContent = ' Turn On Torch';
    fullscreenBtn.prepend(createIcon('fas fa-lightbulb')); // Change icon to lightbulb
    fullscreenBtn.classList.remove('on');
    fullscreenBtn.classList.add('off');
    footer.classList.remove('hidden'); // Show footer again
    isTorchOn = false;
  }
});

// Helper function to create icons dynamically
function createIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = iconClass;
  return icon;
}

// Exit fullscreen on ESC key press
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    isTorchOn = false;
    fullscreenBtn.textContent = ' Turn On Torch';
    fullscreenBtn.prepend(createIcon('fas fa-lightbulb'));
    fullscreenBtn.classList.remove('on');
    fullscreenBtn.classList.add('off');
    footer.classList.remove('hidden');
  }
});

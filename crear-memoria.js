const form = document.getElementById('memoryForm');
const steps = [...document.querySelectorAll('.form-step')];
const stepList = [...document.querySelectorAll('#stepList li')];
const prev = document.getElementById('prevButton');
const next = document.getElementById('nextButton');
const submit = document.getElementById('submitButton');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const message = document.getElementById('formMessage');
let current = 0;
let furthestStep = 0;

function showStep() {
  steps.forEach((step, index) => step.classList.toggle('active', index === current));
  stepList.forEach((step, index) => {
    step.classList.toggle('active', index === current);
    step.classList.toggle('completed', index < furthestStep);
    step.classList.toggle('available', index <= furthestStep);
    step.setAttribute('aria-current', index === current ? 'step' : 'false');
  });
  progressText.textContent = `Paso ${current + 1} de ${steps.length}`;
  progressBar.style.width = `${((current + 1) / steps.length) * 100}%`;
  prev.style.visibility = current === 0 ? 'hidden' : 'visible';
  next.style.display = current === steps.length - 1 ? 'none' : 'inline-flex';
  submit.style.display = current === steps.length - 1 ? 'inline-flex' : 'none';
  message.textContent = '';
  window.scrollTo({ top: document.querySelector('.form-shell').offsetTop - 20, behavior: 'smooth' });
}

function validateStep() {
  const fields = [...steps[current].querySelectorAll('[required]')];
  let valid = true;
  fields.forEach((field) => {
    if (!field.checkValidity()) {
      field.reportValidity();
      valid = false;
    }
  });
  return valid;
}

function goToStep(index) {
  if (index <= furthestStep) {
    current = index;
    showStep();
  }
}

next.addEventListener('click', () => {
  if (validateStep() && current < steps.length - 1) {
    current += 1;
    furthestStep = Math.max(furthestStep, current);
    showStep();
  }
});

prev.addEventListener('click', () => {
  if (current > 0) {
    current -= 1;
    showStep();
  }
});

stepList.forEach((step, index) => {
  step.setAttribute('role', 'button');
  step.setAttribute('tabindex', '0');
  step.addEventListener('click', () => goToStep(index));
  step.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToStep(index);
    }
  });
});

document.querySelectorAll('.add-item').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    const template = document.getElementById(button.dataset.template);
    const limit = Number(button.dataset.limit);
    if (target.children.length >= limit) {
      message.textContent = `Puedes añadir un máximo de ${limit} elementos en esta sección.`;
      return;
    }
    target.appendChild(template.content.cloneNode(true));
    renumber(target);
  });
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-item')) {
    const list = event.target.closest('.repeat-list');
    event.target.closest('.repeat-card').remove();
    renumber(list);
  }
});

function renumber(list) {
  [...list.querySelectorAll('.item-number')].forEach((number, index) => {
    number.textContent = index + 1;
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  message.textContent = 'Gracias. Tu solicitud se ha preparado correctamente. En esta demostración no se envían datos a un servidor; el siguiente paso será conectar el formulario a un servicio seguro de recepción.';
  message.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('year').textContent = new Date().getFullYear();
showStep();
const beanUrl = "https://localhost:5001/api/beanvariety/";
const coffeeUrl = "https://localhost:5001/api/coffee/";

const body = document.querySelector("#body");
const beansButton = document.querySelector("#run-button-beans");
const coffeeButton = document.querySelector("#run-button-coffee");
const newBeanButton = document.querySelector("#new-beans");

body.addEventListener("stateChanged", (event) => {
  render();
});

const render = () => {
  fetchBeans()
    .then(() => fetchCoffee())
    .then(() => {
      body.innerHTML = Beans();
    });
};

// ~~~~~~~~~

const Beans = () => {
  
  beansButton.addEventListener("click", () => {
    getAllBeanVarieties().then((beanVarieties) => {
      console.log(beanVarieties);
      document.querySelector("#beanInnards").innerHTML = displayThemBeans();
    });
  });

  coffeeButton.addEventListener("click", () => {
    getAllCoffeeVarieties().then((coffeeVarieties) => {
      console.log(coffeeVarieties);
    });
  });

  newBeanButton.addEventListener("click", () => {
    document.querySelector("#beanForm").innerHTML = displayThatBeanForm();
  });

  return `
  <h1>These beans, am I right?</h1>
  <div id="beanInnards"></div>
  <div id="beanForm"></div>
  `;
};

// ~~~~~~~~~
const displayThemBeans = () => {
  return `
  <h3>Beans is all there is</h3>
  <br>
  <div>Here's your bean info</div>
    <ul>
  ${applicationState.beans
    .map((bean) => {
      return `
    <li>${bean.name}</li>
    <ul>
      <li>Derived from: ${bean.region}</li>
      <li>More info: ${bean.notes}</li>
    </ul>
    `;
    })
    .join("")}
    </ul>
  `;
};

const displayThatBeanForm = () => {
  return `
  <h3>New bean form just dropped!</div>
  <br>
  <div class="field">
          <label class="label" for="beanName">Name of bean variety</label>
          <input type="text" name="beanName" class="input" />
      </div>
      <div class="field">
          <label class="label" for="beanOrigin">From whence does this bean derive?</label>
          <input type="text" name="beanOrigin" class="input" />
      </div>
      <div class="field">
          <label class="label" for="beanNotes">Tell me more about this particular bean.</label>
          <input type="text" name="beanNotes" class="input" />
      <button class="button" id="submitNewBean">Send the bean into the nethers</button>
  `;
};

// ~~~~~~~~~

body.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id === "submitNewBean") {
    const beanName = document.querySelector("input[name='beanName']").value;
    const beanOrigin = document.querySelector("input[name='beanOrigin']").value;
    const beanNotes = document.querySelector("input[name='beanNotes']").value;

    dataToSendToAPI = {
      Name: beanName,
      Region: beanOrigin,
      Notes: beanNotes,
    };

    sendBean(dataToSendToAPI);
  }
});

// ~~~~~~~~~

const fetchBeans = () => {
  return fetch(`${beanUrl}`)
    .then((response) => response.json())
    .then((beansResponse) => {
      applicationState.beans = beansResponse;
    });
};

const fetchCoffee = () => {
  return fetch(`${coffeeUrl}`)
    .then((response) => response.json())
    .then((coffeeResponse) => {
      applicationState.coffee = coffeeResponse;
    });
};

// ~~~~~~~~~
//^ Application State
const applicationState = {
  beans: [],
  coffee: [],
};

const sendBean = (newBean) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newBean),
  };

  return fetch(`${beanUrl}`, fetchOptions)
    .then((response) => response.json())
    .then(() => {
      body.dispatchEvent(new CustomEvent("stateChanged"));
    });
};

// ~~~~~~~~~

function getAllBeanVarieties() {
  return fetch(beanUrl).then((resp) => resp.json());
}

function getAllCoffeeVarieties() {
  return fetch(coffeeUrl).then((resp) => resp.json());
}

render();

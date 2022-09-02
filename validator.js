class Validator {
    constructor(config){
        this.elementsConfig = config;
        this.errors = {};
        this.generateErrorsObject();
        this.inputListener();
    }
    generateErrorsObject(){
        for(let field in this.elementsConfig){
            // svako polje dobija error niz.
            this.errors[field] = [];
        }
    }
    inputListener(){
        let inputSelector = this.elementsConfig;
        
        for(let field in inputSelector){
            let el = document.querySelector(`input[name="${field}"]`);
            el.addEventListener('input', this.validate.bind(this))
        }
    }
    validate(e){
        let elFields = this.elementsConfig; //all fields
        // console.log(elFields);
        let field = e.target; //current field
        let fieldName = field.getAttribute('name');
        let fieldValue = field.value;

        //error za svaki field name ako ima errora
        this.errors[fieldName] = [];

        //provjeravamo jel required
        if(elFields[fieldName].required){
            //ako jest provjeravamo jel polje prazno
            if(fieldValue === ""){
                this.errors[fieldName].push('Field is empty!');
            }
        }

        if(elFields[fieldName].email){
            if(!this.validateEmail(fieldValue)){
                this.errors[fieldName].push('Bad email');
            }
        }

        if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength){
            this.errors[fieldName].push(`Field must have min ${elFields[fieldName].minlength} and max ${elFields[fieldName].maxlength} characters.`)
        }

        if(elFields[fieldName].matching){
            let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);

            if(fieldValue !== matchingEl.value){
                this.errors[fieldName].push('Password does not match.');
            }

            if(this.errors[fieldName].length === 0){
                this.errors[fieldName] = [];
                this.errors[elFields[fieldName].matching] = [];
            }
        }

        this.populateErrors(this.errors); //ispis gresaka

    }

    populateErrors(errors){
        for(const elem of document.querySelectorAll('ul')){
            elem.remove();
        }
        for(let key of Object.keys(errors)){
            let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
            let errorsElement = document.createElement('ul');
            parentElement.appendChild(errorsElement);

            errors[key].forEach(error=>{
                let li = document.createElement('li');
                li.innerText = error;

                errorsElement.appendChild(li);
            })
        }
    }

    validateEmail(email){
         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return (true);
            }
            return (false);
        }
}

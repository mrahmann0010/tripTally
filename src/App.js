import { useEffect, useState } from "react";

const initialItems = [
  // { id: 1, fieldDes: "Food", fieldCost: 2, packed: false, fieldCat:'food' },
  // { id: 2, fieldDes: "Fuel", fieldCost: 12, packed: true, fieldCat:'fuel' },
  // { id: 3, fieldDes: "Tickets", fieldCost: 12, packed: false, fieldCat:'etc' },
];


const fCat = [{type:'Fuel'}, {type:'Food'}, {type:'Toll'}, {type:'Tickets'}, {type:'Miscellaneous'}];





export default function App(){
return(
  <div>

    <Logo />
    {/* <Hero /> */}
    <DataPart />
    <ResultPart />
    <Footer />
    {/* <Nav /> */}
    
  </div>
)  
};







function DataPart () {
  const [fields, setFields] = useState(initialItems);
  
  function addFields(item) {
    setFields((fields)=> [...fields, item]);
  };
  function removeFields(id) {
    setFields((fields)=> fields.filter(field=> field.id !== id))

  };

  function totalExp(items) {
    const sums =items.reduce((accumulator, item) => {
      return accumulator + item.fieldCost;
    }, 0);
    return sums;
  }

  function handleClearList() {
    setFields([]);
  }

  const totalExpense = (totalExp(fields));

  return (
    <div>
      <Form onAddItems={addFields} fCat={fCat}/>
      <List fields={fields} onRemoveItems={removeFields}/>
      <Result totalExpense={totalExpense} onClearList={handleClearList} fields={fields}/>

      {/* <Summary fields={fields}/> */}
    </div>
  )
}

function Logo() {
  return (
    <div>
      <h1>Trip Tally</h1>
    </div>
  )
};



function Form({onAddItems, onRemoveItems, fCat}) {

  const [fieldDes, setFieldDes] = useState('');
  const [fieldCost, setFieldCost] = useState('');
  const [fieldCat, setFieldCat] = useState('Fuel');

  function handleSubmit(event){
    event.preventDefault();

    if(!fieldDes) return;

    const newItem = {fieldDes, fieldCost, id:Date.now(), fieldCat};

    setFieldDes('');
    setFieldCost('');


    onAddItems(newItem);

  };


  return (
    <div className='form-con'>
          <h3>List your expenses here:</h3>

          <form className='ad-form' onSubmit={handleSubmit}>
            
              <input type='text' placeholder='Item' value={fieldDes} onChange={(e)=> setFieldDes(e.target.value)}></input>
              <input type='text' placeholder='Price' value={fieldCost} onChange={(e)=> setFieldCost(Number(e.target.value))}></input>
              <select value={fieldCat} onChange={(e)=> setFieldCat(e.target.value)}> {fCat.map((field=>(
                <option value={field.type}> {field.type}</option>
              )))}</select>

      
              <button>Add</button>    

          </form>
    </div>

  )
};



function List({fields, onRemoveItems}) {
  return (
    <div className='list'>
      <ul>
        {fields.map((item => (
          <Expenses item = {item} key={item.name} onRemoveItems={onRemoveItems}/>
        )))}
      </ul>
      
    </div>
  )
};

function Expenses ({item, onRemoveItems}) {
  return (
    <li>
      {/* <span style={item.packed?{textDecoration:'line-through'}:{}}>
      {item.fieldDes} {item.fieldCost} 
      </span> */}
      <span className='list-field'>- {item.fieldDes.substring(0, 1).toUpperCase() + item.fieldDes.substring(1)}</span>
      <span className='list-price'>¥ {item.fieldCost}</span>
      <button onClick={()=> onRemoveItems(item.id)}>❌</button>
    </li>

  )
}


function Result({totalExpense, onClearList, fields}) {

  

  function srcolIn() {
    // Function for Scrolling the element into view when the button is pressed;
    const targetSeg = document.querySelector('.result-sec-con').getBoundingClientRect();
    window.scrollTo({top: targetSeg.top+window.scrollY, behavior:'smooth'});
    
  };
  

  const [showCalcBtn, setCalcBtn] = useState(true);
  function calcHandler() {
    // if the list is empty, then calculate won't work
    if(fields.length!==0) {
      setCalcBtn((curState)=> !curState);
      srcolIn();
    }



  }

  function clearHanlder() {
    onClearList();
    setCalcBtn((curState)=>!curState);
  }

  function clearHanlder2 () {
    onClearList();
    const targetSegment2 = document.querySelector('.form-con');
    window.scrollTo({top: targetSegment2.top+window.scrollY, behavior:'smooth'});

  }
  return(
  <div>
    <div className='extra-btn'>
      <button onClick={clearHanlder2}>Clear List</button>
    </div>

    <div className='result-sec-con'>
    {showCalcBtn?(<div className='form-con'>
      <div className='ad-form'>
        <button onClick={calcHandler}>Calculate</button>    
      </div>
      <h3>Calculate the Total Expense</h3>


    </div>):(
      <div>
        <div className='form-con con-1'>
          <h3>The total is - ¥ {totalExpense}</h3>
          <Summary fields={fields}/>

          <button onClick={(e)=> {clearHanlder();clearHanlder2();}}>Recalculate</button>
        </div>


      </div>
    )
    }
    </div> 
  </div>
    
    

  )
}




function Nav() {
  return(
    <div className="sticky-nav">
        <ul className="nav-menu">
          <li>Home</li>
          <li>Summary</li>
          <li>Option 3rw</li>
        </ul>
    </div>
  )
}

function ResultPart() {

}

function Summary({fields}) {
  const expenseByCategories = {};
  fields.forEach(item=> {
    if(expenseByCategories.hasOwnProperty(item.fieldCat)) {
      expenseByCategories[item.fieldCat].push(item);
    } else {
      expenseByCategories[item.fieldCat] = [item];
    }
  })

  const categoryTotals = {};

  for (const category in expenseByCategories) {
    if (Object.prototype.hasOwnProperty.call(expenseByCategories, category)) {
        const categoryExpenses = expenseByCategories[category];
        const totalCost = categoryExpenses.reduce((acc, expense) => acc + expense.fieldCost, 0);
        categoryTotals[category] = totalCost;
    }
  }
  const categoryArray = Object.entries(categoryTotals);

  return(
    <div className='summary-con'>
      <h3>Here's the summary - </h3>
      <ul>
        {categoryArray.map(item=>(
          <SumList item={item}/>
        ))}
      </ul>
    </div>
  )
}

function SumList({item}) {
  return(
    <li>
      <span>{item[0]} -</span>
      <span>¥{item[1]}</span>
    </li>
  )
}


function Footer() {
  const [msgButton, msgBtnSet] = useState('active');
  const contactSection = document.getElementById('ccc');
  console.log(contactSection);



  function conTact() {
    if(msgButton==='active') {
      console.log('hello');
      return(
        <Cta onConTact={conTact}/>
      )
    }


  }

  return (
    <div className='stats'>
      <h6>Developed by Romel</h6>
      
      <a href='https://open.spotify.com/album/2pqdSWeJVsXAhHFuVLzuA8?si=G-BvViT7QX6ExKNoLKNtDg' className="on-rep" target='_blank'>
              <div class="on-rep-text">
                <span class="on-rep-text-d">On repeat</span>
                <span class="on-rep-text-d s-t">As it was</span>
              </div>
              <span class="on-rep-img">
                <img src="imgs/on-rep-img.jpeg" alt="" class="on-rep-img"/>
              </span>
      </a>

      <div className='stat-menu'>
        <ul>
          <li id='stat-h'>Elsewhere</li>
          <li className='stat-t'><a href='https://instagram.com/romel____' target='_blank'>Instagram</a></li>
          <li className='stat-t'><a href='https://facebook.com/mrahmann0010' target='_blank'>Facebok</a></li>
          <li className='stat-t'><a href='mailto:rahmanromel@yahoo.com' target='_blank'>Mail</a></li>
        </ul>
        <ul>
          <li id='stat-h'>Contact</li>
          <li className='stat-t' onClick={conTact} >Message</li>
        </ul>
      </div>
      
    </div>
  )
};


// Message

function Cta({onConTact}) {
  return(
    <div>
      <div className="contact contact-content-sp" id="ccc" style="display: block; bottom: 40px;">

<div class="contact-header">
  <div class="contact-header-texts">

    {/* <div>
      <img src="/About/aboutimg.jpeg" alt="" class="c-h-i">

    </div> */}
    <div>
      <h6 class="c-h-t">Sean Bot</h6>
      <h6 class="c-h-st">Ask me a question</h6>
    </div>
  </div>
  <div>
    <button id="closeButton"><i class="bi bi-x-lg"></i></button>
  </div>    
</div>
<div class="contact-body">
  <div class="contact-msg-con"><span className="contact-msg">Hi!</span></div>
  <div class="contact-msg-con"><span className="contact-msg">How can I help you today?</span></div>
  <div class="contact-msg-con"><span className="contact-msg">Suhailia</span></div>

  <div class="contact-msg-con"><span className="contact-msg contact-msg-query">Suhailia</span></div>          
  <div class="contact-msg-con"><span className="contact-msg contact-msg-query">Just saying hello</span></div>          
  <div class="contact-msg-con"><span className="contact-msg contact-msg-query">Show my portfolio</span></div>          
  <div class="contact-msg-con"><span className="contact-msg contact-msg-query">How can I hire?</span></div>          

    
</div>


</div>
    </div>
  )
}
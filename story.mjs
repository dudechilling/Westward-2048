// All prose and choice consequences in this file are original to Westward: 2048.
// The first nine entries retain their historic indices for version-1 save compatibility.
export const EVENTS = [
  { id:'shortwave', kind:'signal', title:'A voice in the static', text:'A stranger says the northern road is clear. Your map says the bridge became gravel two winters ago. The voice ends with a sponsored message for funeral insurance.', choices:[
    {label:'Trust the voice', effect:{distance:42,fuel:-5}, message:'The shortcut works. The insurance sales pitch almost earns your respect.'},
    {label:'Trust the map', effect:{day:2,morale:-3}, message:'Two extra days. Everyone survives the indignity of being right.'}]},
  { id:'smoke', kind:'hazard', title:'The sky is on fire again', text:'A wall of smoke eats the road. Someone once called this an unprecedented event. By the fourth one, the word lost its fucking meaning.', choices:[
    {label:'Seal the truck and wait', effect:{day:2,food:-3}, message:'Two days of stale air, warm crackers and listening to Riley breathe.'},
    {label:'Gun it through the smoke', effect:{health:-19,distance:35,morale:-5}, message:'You gain ground and lose several functional lung cells.'}]},
  { id:'depot', kind:'salvage', title:'Something in the supply depot', text:'A warehouse door swings in the wind. Inside: crates, footprints and a motivational poster promising a bright future. The poster is the scariest thing here.', choices:[
    {label:'Search every aisle', effect:{food:14,parts:1,health:-12}, message:'You find food and a working alternator. One person catches a nail. The nail wins.'},
    {label:'Leave the depot', effect:{morale:2}, message:'The warehouse can keep its corporate culture.'}]},
  { id:'bridge', kind:'hazard', title:'The bridge is a memory', text:'The last bridge across the gorge has become modern sculpture: six pillars, three cables, zero bridge.', choices:[
    {label:'Build a crossing', effect:{parts:-2,day:2,distance:20}, message:'It holds. Your structural-engineering degree from YouTube remains undefeated.'},
    {label:'Take the detour', effect:{fuel:-12,day:3}, message:'Three days around a hole in the ground. Civilization died. Roadworks did not.'}]},
  { id:'strangers', kind:'people', title:'Strangers with directions', text:'A tired convoy offers a shortcut in exchange for drinking water. Their leader has the desperate sincerity of a used-car salesperson.', choices:[
    {label:'Share eight water', effect:{water:-8,morale:12,distance:24}, message:'The directions work. Against all precedent, a stranger on the road was helpful.'},
    {label:'Keep driving', effect:{morale:-4}, message:'Silence fills the truck. It weighs more than eight bottles of water.'}]},
  { id:'engine', kind:'mechanical', title:'The truck sounds terminal', text:'The transmission knocks like a landlord demanding rent. The noise is getting louder.', choices:[
    {label:'Replace the damaged part', effect:{parts:-1,condition:32}, message:'The truck purrs. Nobody wants to discuss what a purr means in a truck.'},
    {label:'Repair it with scrap', effect:{day:1,condition:12,health:-8}, message:'The duct tape holds. Someone loses an argument with a spinning belt.'}]},
  { id:'clinic', kind:'salvage', title:'The abandoned clinic', text:'Someone left the medicine. They took the television and the good coffee machine. Humanity had priorities.', choices:[
    {label:'Search the cabinets', effect:{medicine:2,day:1}, message:'Two sealed medical kits. A miracle with an expiry date.'},
    {label:'Stay on schedule', effect:{distance:18}, message:'You pass the clinic. The rearview mirror offers no second opinion.'}]},
  { id:'checkpoint', kind:'people', title:'Toll booth from hell', text:'A checkpoint militia demands twenty credits for protection from bandits. Their uniforms match the bandits you met yesterday.', choices:[
    {label:'Pay twenty credits', effect:{credits:-20}, message:'They smile and wave you through. Extortion has excellent customer service.'},
    {label:'Slip through a side road', effect:{fuel:-9,condition:-11}, message:'The undercarriage becomes a percussion instrument. The militia earns nothing.'}]},
  { id:'haven_signal', kind:'signal', title:'A signal from Haven', text:'“Western gate operating,” says a faint voice. For a moment, the truck falls quiet enough to hear people hope.', choices:[
    {label:'Tell everyone the good news', effect:{morale:13}, message:'For one night, nobody dreams about dying.'},
    {label:'Keep expectations low', effect:{morale:2}, message:'You note the frequency. Hope feels too expensive to waste.'}]},
  { id:'subscription', kind:'people', title:'The apocalypse has a paywall', text:'A working vending machine offers drinking water. The screen reads: BASIC SURVIVAL — $9.99/MONTH. Premium subscribers can apparently use their thumbs.', choices:[
    {label:'Break the damn thing', effect:{water:25,condition:-5}, message:'Twenty-five units of water spill out. You void a warranty older than the nation.'},
    {label:'Pay the machine', effect:{credits:-10,water:18}, message:'The machine prints a receipt and asks for a five-star review. You consider murder.'}]},
  { id:'crypto', kind:'salvage', title:'The bunker of financial geniuses', text:'Seven surviving crypto investors explain how the collapse is actually bullish. They have no vegetables, but they do have a whiteboard.', choices:[
    {label:'Trade old batteries for fuel', effect:{parts:-1,fuel:25}, message:'The investors call it a decentralized liquidity event. You call it petrol.'},
    {label:'Leave them to their market', effect:{morale:6}, message:'You leave before anyone says “tokenomics.” The crew celebrates.'}]},
  { id:'influencer', kind:'people', title:'One last livestream', text:'A man wearing a ring light is broadcasting his own mugging. Eleven viewers. Nine bots. His final sponsor is a mattress company.', choices:[
    {label:'Help him escape', effect:{day:1,medicine:1,morale:7}, message:'He offers you a sponsorship deal. You take his medical kit instead.'},
    {label:'Keep driving', effect:{morale:-3,distance:15}, message:'The broadcast continues. At least the comment section is gone.'}]},
  { id:'corporate', kind:'hazard', title:'Employee evacuation corridor', text:'A corporate bus sits across the highway. A sign reads: EMERGENCY EXIT — PLATINUM MEMBERS ONLY. Every seatbelt is a microtransaction.', choices:[
    {label:'Strip it for usable parts', effect:{parts:2,day:1,condition:-3}, message:'You recover two good components and the ghost of an HR meeting.'},
    {label:'Take the shoulder', effect:{fuel:-7,distance:17}, message:'You leave the world’s least affordable bus stop behind.'}]},
  { id:'water_law', kind:'people', title:'The mayor of an empty town', text:'One man has appointed himself mayor, council and municipal newsletter. He charges a water tax. His approval rating is 100 per cent. He is the only voter.', choices:[
    {label:'Pay the water tax', effect:{credits:-8,water:22}, message:'He hands you a receipt and asks if you plan to run against him.'},
    {label:'Ignore municipal authority', effect:{morale:3,water:-6}, message:'He declares a state of emergency. Nobody shows up.'}]},
  { id:'grave_goods', kind:'salvage', title:'The most expensive coffin', text:'A wrecked luxury SUV contains a skeleton, six designer watches and a portable espresso machine. The fuel tank is empty. Well played, capitalism.', choices:[
    {label:'Take what sells', effect:{credits:23,day:1}, message:'The watches are worthless as watches, but a trader loves the gold.'},
    {label:'Take the coffee machine', effect:{morale:12,condition:-4}, message:'It works twice before smoking. Best twelve minutes of the apocalypse.'}]},
  { id:'shelter', kind:'hazard', title:'The government help desk', text:'A concrete shelter is still open. The staff requires proof of address, two photo IDs and a signed affidavit confirming your apocalypse.', choices:[
    {label:'Wait in the fucking queue', effect:{day:2,food:28,water:18}, message:'You collect supplies. The clerk asks when you plan to stop being homeless.'},
    {label:'Walk out', effect:{morale:10}, message:'Freedom smells like diesel and bureaucratic defeat.'}]},
  { id:'feral_accountant', kind:'people', title:'The last accountant', text:'A person wearing a tie offers to audit your supplies. “The dead still owe taxes,” they insist. They have a very sharp pencil.', choices:[
    {label:'Let them check the inventory', effect:{food:12,credits:8,morale:-4}, message:'They find wasted supplies and bill you for consulting.'},
    {label:'Drive away immediately', effect:{distance:16,morale:6}, message:'For once, tax avoidance is a moral victory.'}]},
  { id:'radio_pastor', kind:'signal', title:'The roadside prophet', text:'A prophet sells spiritual immunity, expired batteries and a podcast subscription. His apocalypse predictions were very precise, unlike his hygiene.', choices:[
    {label:'Buy useful batteries', effect:{credits:-12,fuel:13}, message:'The batteries work. His cosmic predictions remain unfalsifiable.'},
    {label:'Ask for an actual miracle', effect:{morale:5,day:1}, message:'He refuses, citing supply-chain issues in heaven.'}]},
  { id:'dead_mall', kind:'salvage', title:'Mall of the recently deceased', text:'Escalators run on emergency power. Every shop is abandoned except a kiosk selling phone cases. The phones died years ago.', choices:[
    {label:'Raid the food court', effect:{food:27,water:10,day:1}, message:'You recover sealed tins. Nobody is brave enough to try the sushi.'},
    {label:'Salvage electronics', effect:{parts:2,condition:-5}, message:'The parts may keep the truck alive. The receipt says no returns.'}]},
  { id:'ai_help', kind:'signal', title:'The automated evacuation line', text:'A government voice bot answers the emergency hotline. “Your extinction is important to us. Estimated hold time: 900 years.”', choices:[
    {label:'Wait for a human', effect:{day:1,morale:-8}, message:'You spend a day hearing “Your call is our priority.” A bold lie.'},
    {label:'Pull the line for spare copper', effect:{parts:1,morale:4}, message:'Useful metal. The bot thanks you for your patience.'}]},
  { id:'scarecrow', kind:'hazard', title:'A field of warning signs', text:'The valley is dotted with signs reading CONTAMINATED. Someone has crossed out the word and written ALREADY FUCKED.', choices:[
    {label:'Test the water carefully', effect:{day:1,water:23,health:-6}, message:'You find a usable spring, with a small price paid in nausea.'},
    {label:'Keep your water sealed', effect:{water:-9,morale:3}, message:'The truck passes the signs. Nobody looks back.'}]},
  { id:'drones', kind:'hazard', title:'The delivery drones never stopped', text:'A swarm of autonomous drones delivers packages to houses with no roofs. One circles you, insisting you accept a pair of slippers.', choices:[
    {label:'Catch a drone', effect:{parts:2,health:-9}, message:'You salvage a battery and a motor. The drone files a complaint.'},
    {label:'Let it deliver the slippers', effect:{morale:4}, message:'The package is addressed to a man who died eleven years ago.'}]},
  { id:'backwoods', kind:'people', title:'The commune with a mission statement', text:'A new settlement promises equality, shared labour and optional weekly sacrifice. The brochure omits the last part.', choices:[
    {label:'Trade food for fuel', effect:{food:-18,fuel:25}, message:'A fair exchange, by apocalypse standards. You decline membership.'},
    {label:'Stay the night, then run', effect:{day:1,health:8,morale:-8}, message:'You sleep indoors. An initiation chant at dawn decides the matter.'}]},
  { id:'roadkill', kind:'salvage', title:'Fresh meat, allegedly', text:'An animal lies beside the highway. It has six legs. Morgan says four of them are probably traditional.', choices:[
    {label:'Cook it very thoroughly', effect:{food:20,health:-10}, message:'Dinner tastes like a pharmaceutical lawsuit.'},
    {label:'Keep the tins closed', effect:{morale:4}, message:'Nobody wants to be Patient Zero twice.'}]},
  { id:'open_source', kind:'signal', title:'The last working server', text:'A dusty rack server broadcasts an open-source survival guide. Its comments section is full of people arguing over tabs versus spaces.', choices:[
    {label:'Download the maintenance diagrams', effect:{condition:18,day:1}, message:'The diagrams save your transmission. The comment war continues.'},
    {label:'Harvest the backup batteries', effect:{fuel:19,condition:-3}, message:'You disconnect the machine. Someone somewhere loses an argument.'}]},
  { id:'luxury', kind:'people', title:'Glamping beyond the end of days', text:'A luxury retreat sells “authentic survival experiences” to people who survived. A sign promises locally sourced despair and complimentary trauma.', choices:[
    {label:'Borrow their stored rations', effect:{food:23,credits:-8}, message:'The clerk charges an “end-of-world experience fee.”'},
    {label:'Steal their generator belt', effect:{parts:1,morale:-5}, message:'You leave with one useful belt and an outstanding Yelp review.'}]},
  { id:'silent_road', kind:'hazard', title:'The toll of silence', text:'No birds, no engines, no wind. A roadside billboard says WE CARE ABOUT YOU. It belongs to a company selling graves.', choices:[
    {label:'Stop and take stock', effect:{day:1,morale:8}, message:'The crew says little. Silence becomes a resource of its own.'},
    {label:'Turn up the radio', effect:{fuel:-3,morale:4,distance:11}, message:'The only station plays an ad for home insurance.'}]},
  { id:'weapons', kind:'people', title:'Nobody owns the road', text:'Two armed travellers want to collect a “security contribution.” A third stands behind them holding a spreadsheet.', choices:[
    {label:'Part with some fuel', effect:{fuel:-12,morale:-6}, message:'They take the fuel and call it voluntary.'},
    {label:'Drive around the blockade', effect:{condition:-15,distance:18}, message:'You escape in a spray of gravel. The spreadsheet gets flattened.'}]},
  { id:'museum', kind:'salvage', title:'Museum of previous mistakes', text:'A museum of the old world features a donation box, the history of extinction and a gift shop selling novelty mugs. Its doors are unlocked.', choices:[
    {label:'Strip its solar panels', effect:{fuel:24,day:1}, message:'A museum finally contributes something to the future.'},
    {label:'Take the evacuation map', effect:{distance:30,morale:3}, message:'The map shows a service road. Someone in 2032 was briefly competent.'}]},
  { id:'union', kind:'people', title:'Organized labour, disorganized world', text:'A group of mechanics has formed the Last Human Union. They want three litres of water and assurances against unpaid overtime.', choices:[
    {label:'Hire a mechanic', effect:{water:-12,condition:27}, message:'A professional repair. The crew votes unanimously for collective bargaining.'},
    {label:'Fix it yourself', effect:{day:1,condition:10,health:-5}, message:'The truck runs. Your hands disagree with your confidence.'}]},
  { id:'social_credit', kind:'people', title:'The reputation economy refuses to die', text:'A settlement will let you through, but first you must submit a personal branding statement and two references. The gate has no electricity.', choices:[
    {label:'Deliver a heartfelt speech', effect:{day:1,morale:-6,credits:10}, message:'They give you ten credits for “thought leadership.” Your soul loses market value.'},
    {label:'Tell them to fuck off', effect:{morale:11,condition:-3}, message:'The gate swings open. Public speaking has never felt so efficient.'}]},
  { id:'plastic', kind:'hazard', title:'The plastic ocean', text:'A lake of black sludge blocks the road. Fishing line, shopping bags and a shopping cart move beneath the surface.', choices:[
    {label:'Try the old causeway', effect:{fuel:-11,condition:-8,distance:25}, message:'The wheels nearly disappear. The truck survives an environmental policy failure.'},
    {label:'Wait for low water', effect:{day:2,food:-5}, message:'The water recedes. The shopping cart remains undefeated.'}]},
  { id:'billboard', kind:'signal', title:'Your future is sponsored', text:'A solar billboard flickers: CONGRATULATIONS ON YOUR RESILIENCE. A second screen asks you to accept cookies. You have not eaten a cookie in four years.', choices:[
    {label:'Rip out the solar battery', effect:{fuel:17,day:1}, message:'You disable marketing for at least one square kilometre.'},
    {label:'Keep your dignity', effect:{morale:7}, message:'The billboard asks you to reconsider. You don’t.'}]},
  { id:'autopilot', kind:'mechanical', title:'The autonomous car uprising', text:'A self-driving car repeatedly tries to turn left onto a road no longer there. Its owner is a skeleton with excellent posture.', choices:[
    {label:'Strip it for sensors', effect:{parts:2,condition:-4}, message:'The car chirps “Have a wonderful day” as you remove its brain.'},
    {label:'Use its cached road map', effect:{distance:26,fuel:-4}, message:'The old map is outdated, but one shortcut still exists.'}]}
];

export const MILESTONE_EVENTS = [
  { mile:160, id:'ashwood', kind:'checkpoint', title:'Ashwood Junction', text:'A skeletal interchange stretches in every direction. The last roadside restaurant is called Last Exit. A hand-painted sign promises hot coffee and colder bodies.', choices:[
    {label:'Search the diner',effect:{food:16,day:1},message:'The coffee is undrinkable. The tins are not.'},
    {label:'Take the maintenance bypass',effect:{distance:24,fuel:-7},message:'The bypass is rough. Its old crew deserves a medal.'}]},
  { mile:335, id:'basin', kind:'checkpoint', title:'The Dry Basin', text:'A reservoir reduced to cracked earth. The old emergency plan suggested conservation. Someone wrote “Bit fucking late” over the sign.',choices:[
    {label:'Dig for groundwater',effect:{day:1,water:28,health:-5},message:'You find brackish water. It boils clean enough.'},
    {label:'Trust the remaining supplies',effect:{water:-8,morale:6},message:'You move before the heat gets worse.'}]},
  { mile:525, id:'blackglass', kind:'checkpoint', title:'Blackglass Ridge', text:'The hillside melted into black glass after the firestorms. There is no vegetation, only a sign declaring a “successful fuel-treatment partnership.”',choices:[
    {label:'Cross at dawn',effect:{day:1,condition:-9},message:'You make it through with a blistered radiator.'},
    {label:'Drive the ridge by night',effect:{fuel:-11,morale:-4},message:'The ridge is less hot, but much harder to see.'}]},
  { mile:720, id:'relay', kind:'checkpoint', title:'Relay Station Nine', text:'A live radio transmitter hums above a wrecked town. A recorded voice repeats: “We are experiencing higher than normal apocalypse volumes.”',choices:[
    {label:'Boost the signal to Haven',effect:{day:1,morale:16},message:'A human answers. Haven has fuel, roofs and someone who makes terrible coffee.'},
    {label:'Strip the spare generators',effect:{fuel:28,condition:-4},message:'The transmitter fades. Your engine will live a little longer.'}]},
  { mile:905, id:'pass', kind:'checkpoint', title:'The Broken Pass', text:'A half-collapsed tunnel cuts through the mountains. Its safety rating reads EXCELLENT, last inspected in 2031 by a man now very dead.',choices:[
    {label:'Crawl through the tunnel',effect:{condition:-16,distance:28},message:'You emerge in daylight with most of your mirrors.'},
    {label:'Follow the snow line',effect:{fuel:-13,day:2,morale:4},message:'A cold, brutal climb. The crew emerges intact.'}]},
  { mile:1080, id:'green', kind:'checkpoint', title:'The Green Line', text:'A living forest appears beyond the blasted plains. It smells like wet soil instead of smoke. Nobody speaks. Nobody wants to scare it away.',choices:[
    {label:'Camp among the trees',effect:{day:1,water:14,health:10,morale:11},message:'A quiet night beneath leaves. For once, the world isn’t asking for payment.'},
    {label:'Push on toward Haven',effect:{distance:28,morale:5},message:'The road slopes west. The engine sounds like a prayer.'}]}
];

export const RADIO_LINES = [
  'PUBLIC SAFETY UPDATE: The official emergency app has requested an update. The update requires an internet connection. Brilliant.',
  'A remaining town council has voted to rename starvation “nutritional downsizing.” Motion carried, 4–0.',
  'Last surviving economist predicts strong growth in the grave-digging sector.',
  'A service station sign reads: FUEL, FOOD, HOPE. Only the last item is sold by the litre.',
  'The final influencer on Earth has announced a “quiet quitting” challenge. The planet accepted.',
  'A roadside church sells absolution by subscription. The free tier includes guilt and advertisements.',
  'Officials remind travellers to wash their hands. The handwashing station is now a crater.',
  'A 2041 campaign poster promises to make tomorrow great. You suspect tomorrow is suing for defamation.',
  'The last call centre is still open. “Due to unusually high extinction volumes, all agents are busy.”',
  'Haven broadcasts 21 seconds of music, then loses power. It was the first good thing you heard all week.',
  'A council has elected a pothole as mayor. Finally, a politician with a tangible platform.',
  'An old luxury ad says YOU DESERVE THE BEST. Everyone agrees. The best is clean water and a fucking sandwich.',
  'A weather station reports “mostly catastrophic,” with a chance of scattered optimism.',
  'The internet is gone, yet somewhere a man is still explaining why his podcast would have saved civilization.',
  'A billboard reads: STAY POSITIVE. Someone underneath wrote: SHOW ME A NEGATIVE RADIATION TEST.',
  'A scavenger says he is not a doomsday prepper. He calls himself a forward-thinking supply-chain consultant.',
  'A school noticeboard lists the evacuation route. The final item reads: “Please return all library books.”',
  'The old national anthem plays. The transmitter cuts out halfway through. The silence is a better verse.'
];

export const ROLES = [
  {name:'Alex',role:'Scout',perk:'Finds more while scavenging'},
  {name:'Morgan',role:'Medic',perk:'Improves treatment'},
  {name:'Jules',role:'Mechanic',perk:'Gets more from repairs'},
  {name:'Sam',role:'Driver',perk:'Uses less fuel on the road'},
  {name:'Riley',role:'Trader',perk:'Negotiates better prices'}
];

export const OBITUARIES={
  Alex:'Alex found a way through every roadblock except the last one. The map feels heavier now.',
  Morgan:'Morgan spent the journey keeping other people alive. The irony is not lost on anyone.',
  Jules:'Jules could fix almost anything. Nobody found the right part this time.',
  Sam:'Sam always said the truck would outlive us. Sam was technically right.',
  Riley:'Riley talked everyone into buying hope. Nobody could haggle with death.'
};

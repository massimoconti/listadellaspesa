<template>
  <div>
    <div id="input-container">
      <textarea type="text" placeholder="Aggiungi alla lista della spesa" v-model="new_entry" @keyup.enter="addNewEntry" @paste="onPaste" @focus="setListAction('')"></textarea>

      <div id="button-container">
        <button @click="voiceRecognitionStart" v-if="voice_recognition" :class="{disabled: !isVoiceRecognitionActive}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
      </div>
    </div>

    <ul id="list" v-if="list_items.length">
      <vuedraggable v-model="list_items" handle=".drag-handle">
        <transition-group appear name="listanim">
          <li v-for="(item, index) in list_items" v-bind:key="index">

            <span
              class="item"
              @click="toggleItemTaken(index)"
              :class="{ taken: item.taken }"
            >
            {{ item.name }}
            </span>

            <transition appear name="fade">
              <span class="action" v-if="!isAction('')">
                <img @click="deleteItem(index, item.name)" v-if="isAction('elimina')" src="../assets/trash-2.svg" alt="">
                <img class="drag-handle" v-if="isAction('riordina')" src="../assets/move.svg" alt="">
              </span>
            </transition>

          </li>
        </transition-group>
      </vuedraggable>
    </ul>

    <div id="emptylist-container" v-if="!list_items.length">
      <p class="emptylist-msg">Niente da comprare</p>

      <div class="emptylist-tip emptylist-text">
        <img src="../assets/arrow.svg" alt="">
        <p>Inserisci nuovi articoli digitandoli...</p>
      </div>

      <div class="emptylist-tip emptylist-voice" v-if="voice_recognition">
        <img src="../assets/arrow.svg" alt="">
        <p>...oppure aggiungili a voce<br>
          separandoli fra loro con "e"</p>
      </div>
    </div>

    <ModalWin v-bind:open.sync="celebrate_modal_open">
      <div class="sa">
        <div class="sa-success">
          <div class="sa-success-tip"></div>
          <div class="sa-success-long"></div>
          <div class="sa-success-placeholder"></div>
          <div class="sa-success-fix"></div>
        </div>
      </div>
      <div class="modal-title">Hai completato la spesa!</div>
      <div class="modal-description">
        <button class="clear" @click="clearItems">
          Elimina tutte le voci
        </button>
      </div>
    </ModalWin>

    <ModalWin v-bind:open.sync="mic_modal_open" @modal_closed="voiceRecognitionStop">
      <div id="mic-icon" v-if="isVoiceRecognitionActive"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></div>
      <div class="modal-title">{{ mic_status }}</div>
      <div class="modal-description">{{ mic_substatus }}</div>
    </ModalWin>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import ModalWin from './ModalWin.vue'

if ('webkitSpeechRecognition' in window){
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'it-IT';
} else {
  var recognition = null;
}

export default {
  name: 'list',
  components: {
    vuedraggable,
    ModalWin,
  },
  mounted: function(){
    this.$store.commit({
      type: 'updateTitle',
      title: this.list_name
    });
  },
  updated: function(){
    this.$store.commit({
      type: 'updateTitle',
      title: this.list_name
    });
  },
  data: () => {
    return {
      new_entry: '',
      count_item_taken: 0,
      celebrate_modal_open: false,
      voice_recognition: recognition,
      mic_modal_open: false,
      mic_status: '',
      mic_substatus: '',
    }
  },
  computed: {
    id: function(){
      return this.$route.params.id;
    },
    list: function(){
      return this.$store.state.lists[this.id];
    },
    list_name: function(){
      return this.list.name;
    },
    list_items: {
      get() {
        return this.list.items;
      },
      set(updated_list) {
        this.$store.commit({
          type: 'updateListItems',
          id: this.id,
          list_items: updated_list,
        });
      }
    },
    isVoiceRecognitionActive: function(){
      return this.voice_recognition && this.isOnline;
    }
  },
  methods: {
    isAction(action){
      return action === this.$store.state.list_action;
    },
    setListAction: function(action){
      this.$store.commit({
        type: 'updateListAction',
        action: action
      })
    },
    addNewEntry: function(){
      this.addItems(this.new_entry)
      this.new_entry = '';
    },
    dispatchNotification: function(msg){
      this.$store.commit({
        type: 'notify',
        notification: msg
      });
    },
    addItems: function(voices){
      var entries = voices.split(/\n|\se\s/).filter(function(voice){ return !!voice });

      entries.forEach(function(item){
        this.$store.commit({
          type: 'pushToList',
          id: this.id,
          item: item
        });
      }.bind(this));

      if (0 === entries.length)
        this.dispatchNotification('Nessun articolo aggiunto');
      else if (1 === entries.length)
        this.dispatchNotification('Nuovo articolo \''+ entries[0] +'\' aggiunto');
      else
        this.dispatchNotification(entries.length + ' articoli aggiunti');
    },
    onPaste: function(){
      setTimeout(function(){
        this.addNewEntry();
      }.bind(this), 200)

      return true;
    },
    toggleItemTaken: function(item_key){
      this.$store.commit({
        type: 'toggleItemTaken',
        id: this.id,
        item_key: item_key
      });

      var items_taken = this.list_items.filter(function(el){
        return !!el.taken;
      });

      if (this.list_items.length === items_taken.length)
        this.celebrate();
    },
    clearItems: function(){
      this.$store.commit({
        type: 'clearItems',
        id: this.id
      });
    },
    deleteItem: function(item_key, name){
      this.$store.commit({
        type: 'deleteItem',
        id: this.id,
        item_key: item_key
      });

      this.dispatchNotification('Articolo \''+ name + '\' eliminato');
    },
    voiceRecognitionStart: function(){
      // TODO autostop afeter 4 seconds of no input
      if (!this.voice_recognition)
        return;

      this.mic_modal_open = true;

      if (!this.isVoiceRecognitionActive){
        this.mic_status = 'Sei offline';
        this.mic_substatus = 'Collegati ad internet per utilizzare la funzione vocale';
        return;
      }

      var start_timestamp = event.timeStamp;
      var final_transcript = '';

      this.voice_recognition.start();

      this.voice_recognition.onstart = function(){
        final_transcript = ''
        this.mic_status = 'Parla ora al microfono';
        this.mic_substatus = 'Clicca per terminare';
      }.bind(this);

      this.voice_recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          this.mic_status = 'No speech was detected';
          this.mic_substatus = 'You may need to adjust your microphone settings';
        }
        if (event.error == 'audio-capture') {
          this.mic_status = 'No microphone was found';
          this.mic_substatus = 'Ensure that a microphone is installed and that microphone settings are configured correctly';
        }
        if (event.error == 'not-allowed') {
          this.mic_substatus = '';

          if (event.timeStamp - start_timestamp < 100) {
            this.mic_status = 'Permission to use microphone is blocked';
          } else {
            this.mic_status = 'Permission to use microphone was denied';
          }
        }
      }.bind(this);

      this.voice_recognition.onend = function() {
        if (!final_transcript)
          return;

        this.addItems(final_transcript);
        this.mic_modal_open = false;
      }.bind(this);

      this.voice_recognition.onresult = function(event){
        if (typeof(event.results) == 'undefined') {
          this.voice_recognition.onend = null;
          this.voice_recognition.stop();
          this.mic_status = 'Funzionalità non supportata';
          this.mic_substatus = '';
          return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal)
            final_transcript += event.results[i][0].transcript;
        }
      }.bind(this);
    },
    voiceRecognitionStop: function(){
      if (!this.voice_recognition)
        return;

      this.voice_recognition.stop();
    },
    celebrate: function(){
      if ('vibrate' in window.navigator)
        window.navigator.vibrate(400);

      this.celebrate_modal_open = true;
    },
  },
}
</script>

<style scoped>
#input-container {
  position:relative;
  padding:0.8rem;
  border-bottom: 1px solid #ced4da;
  border-radius: .25rem;
  background: #fff;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

textarea {
  display: inline-block;
  width:84%;
  height:1.2rem;
  font: 300 1rem Roboto, sans-serif;
  vertical-align: middle;
  resize: none;
  outline: 0;
}
textarea:focus {
  color: #495057;
  background-color: #fff;
  border-color: blue;
}
#button-container {
  z-index: 10;
  position: absolute;
  top:0.3rem;
  right:0.4em;
}
#button-container button {
  display: inline-block;
  opacity: 1;
  background: transparent;
  vertical-align: middle;
  transition: opacity .2s ease-in-out,box-shadow .2s ease-in-out;
  margin-left:0.4rem;
}
#button-container svg {
  color: #333;
  height: 2.1rem;
}

button {
  background: transparent;
  box-shadow: none;
  color:#fff;
}

#button-container button.disabled,
#button-container button[disabled] {
  opacity: 0.5;
}

#list {
  margin: 1rem 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  background: #fff;
  border-radius: .25rem;
  font-size: 1rem;
  color: #333;
}
#list li {
  position: relative;
  border-bottom: 1px solid #01a3e1;
}
#list li span.item {
  display: inline-block;
  padding:.6rem 0 .6rem .7rem;
}
#list li:last-child {
  border-bottom: 0;
}
#list li span.taken {
  text-decoration: line-through;
  color:#aaa
}
#list li.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
#list li span.action {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width:2rem;
  border-left: 1px solid #01a3e1;
  display:inline-block;
  cursor: pointer;
  background: #efefef;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
#list li span.action img {
  height:1.1rem;
  opacity: .7;
}

/*-----------------------------------
 Mic modals
 -----------------------------------*/

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
  }
}

#mic-icon {
  width: 100px;
  height: 100px;
  background: rgba(30, 144, 255, 0.6);
  border-radius: 50%;
  animation: shadow-pulse 1s infinite;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


/*-----------------------------------
 Celebrate icon
 -----------------------------------*/

.sa {
  padding: 20px;
  background-color: #fff;
}
.sa-success {
  border-radius: 50%;
  border: 4px solid #A5DC86;
  box-sizing: content-box;
  height: 80px;
  padding: 0;
  position: relative;
  background-color: #fff;
  width: 80px;
}
.sa-success:after, .sa-success:before {
  background: #fff;
  content: '';
  height: 120px;
  position: absolute;
  transform: rotate(45deg);
  width: 60px;
}
.sa-success:before {
  border-radius: 40px 0 0 40px;
  width: 26px;
  height: 80px;
  top: -17px;
  left: 5px;
  transform-origin: 60px 60px;
  transform: rotate(-45deg);
}
.sa-success:after {
  border-radius: 0 120px 120px 0;
  left: 30px;
  top: -11px;
  transform-origin: 0 60px;
  transform: rotate(-45deg);
  animation: rotatePlaceholder 4.25s ease-in;
}
.sa-success-placeholder {
  border-radius: 50%;
  border: 4px solid rgba(165, 220, 134, 0.25);
  box-sizing: content-box;
  height: 80px;
  left: -4px;
  position: absolute;
  top: -4px;
  width: 80px;
  z-index: 2;
}
.sa-success-fix {
  background-color: #fff;
  height: 90px;
  left: 28px;
  position: absolute;
  top: 8px;
  transform: rotate(-45deg);
  width: 5px;
  z-index: 1;
}
.sa-success-tip, .sa-success-long {
  background-color: #A5DC86;
  border-radius: 2px;
  height: 5px;
  position: absolute;
  z-index: 2;
}
.sa-success-tip {
  left: 14px;
  top: 46px;
  transform: rotate(45deg);
  width: 25px;
  animation: animateSuccessTip .75s;
}
.sa-success-long {
  right: 8px;
  top: 38px;
  transform: rotate(-45deg);
  width: 47px;
  animation: animateSuccessLong .75s;
}

@keyframes animateSuccessTip {
  0%, 54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}
@keyframes animateSuccessLong {
  0%, 65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
@keyframes rotatePlaceholder {
  0%, 5% {
    transform: rotate(-45deg);
  }
  100%, 12% {
    transform: rotate(-405deg);
  }
}

button.clear {
  padding: 0.9rem 0.9rem;
  border-radius: 0.5rem;
  background: #01a3e1;
  color:#fff;
  font-weight: bold;
}

#emptylist-container {
  position: relative;
  padding:  0;
  color: rgb(236, 242, 245);
  font-weight: bold;
  overflow: hidden;
  height: 350px;
}

.emptylist-msg {
  position:absolute;
  display: block;
  width: 100%;
  top: 100px;
  font-size: 1.3rem;
  text-align: center;
  /* text-shadow: 1px 1px 1px #4E342E; */
}

.emptylist-tip {
  width: 100%;
  overflow: hidden;
}

.emptylist-tip p,
.emptylist-tip img {
  position:absolute;
  display: inline-block;
}

.emptylist-tip p {
  background: #0694cc;
  padding:0.5rem;
  border-radius: 0.4rem;
  font-weight: 300;
  color: #ddd;
}

.emptylist-tip img {
  opacity: 0.1;
  -webkit-user-select:none;
  -webkit-touch-callout:none;
}

.emptylist-text p {top: 200px;left: 0;width: 145px;}

.emptylist-text img {
  /* width:100px; */
  height: 140px;
  transform: rotate(-30deg);
  top: 30px;
  left: -26px;
}

.emptylist-voice p {
  top: 270px;
  right: 0;
  width: 200px;
  text-align: right;
}

.emptylist-voice img {
  /* height:250px; */
  transform: rotate(73deg) scale(-1, 1);
  right: -30px;
  top: 25px;
}

.fade-enter-active {
  animation: animate-fade .3s;
}
.fade-leave-active {
  animation: animate-fade .3s reverse;
}

@keyframes animate-fade {
  from { opacity:0 }
  to { opacity:1 }
}

.listanim-enter-active, .listanim-leave-active {
  transition: opacity .3s, transform .3s;
}
.listanim-enter, .listanim-leave-to {
  opacity: 0;
  transform: translateY(-30%);
}
</style>

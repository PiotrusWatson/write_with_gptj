# write_with_gptj
A quick n dirty hack remake of https://transformer.huggingface.co/ but using GPT-J in the back! instead of old gpt2s

Using https://github.com/vicgalle/gpt-j-api to make gpt-j happen.

Hosted here: http://piotrus-watson.alwaysdata.net/

Requires:
  * Python 3 (with pip)
  * npm
  * virtualenv

And a whole host of random crap that should be contained within the respective requirements.txts

To set up locally (in root folder):
  * virtualenv <name_here>
  * source <name_here>/bin/activate
  * pip install -r requirements.txt 
  * npm install
  * npm run build
  * (in config.py -> change isLocal to *True*)
 
To run locally:
  * python main.py

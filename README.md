# Script Weaver

Clone this open source public GitHub repo and build project here fully working 

https://github.com/pathavesonali77-oss/script-weaver-ai.git



1. Everything is working perfectly but some images genration getting failed (not all but some) add auto retry for failed images. After 2 times retry still failed then retry by modifying prompts. I need all images for each timestamps in any condition.

2. I'll dig into how the prompts are actually built and what reaches the image model, since the pictures look generic rather than misplaced.



I looked into why the pictures don't match the script, and I found the real cause before the work paused — nothing has been changed yet.



What's going wrong: The problem isn't the timestamps. The instructions given to the writer that turns each script line into a picture description force it to keep every picture in the "current location" with the same characters, and treat narration, memories and backstory as things that "never move the scene." Your script is mostly a narrator describing demons, the Busan massacre, the army and a special force — so those lines get drawn as your two main characters standing in whatever place the story was last in (a bookstore, a library, a beach). On top of that, an automatic "keep the same people as the last picture" note is added to every description, and a fallback rule pulls a main character into any scene that mentions "he" or "she," even when the line is about soldiers or strangers. Together these produce exactly the generic couple-in-a-library pictures you're seeing. This existed in the original project too, but the newer writer model follows those rules much more strictly, which is why it jumped from ~10% to ~50%.



What needs to be done (not yet applied):

1. Rewrite the writer's rules so each line is drawn as what it literally describes — narration about demons in Busan becomes a picture of demons in Busan, even if that's a different place or time from the previous line.

2. Remove the "same place, same characters as the previous picture" tail added to every description.

3. Only put a named main character into a picture when the line actually names them; never inject them into scenes about soldiers, crowds or strangers.

4. Fix a small text-cleaning bug that deletes chunks of a description between two apostrophes (e.g. everything between "Henan's" and "demon's").



When you're ready to continue, send a message and I'll apply these four changes and run a fresh test set to confirm the pictures follow the script.



 





Pixazo api key 1

03178ba869a446eba82bce98a79fefc3



Pixazo api key 2

048e52aee2094e24bad1b46a0fb15753



Pixazo api key 3



d004a01679f843e7ba090fa1d88c926d



Pixazo api key 4

9379183b074f4655adc0fa351dd4fa29



Note for gemini:-

Don't use Gemini api key parallel use add logic change automatically once daily quota reached. Paraloncloud was parallel because Qwen model was too much limitations.



Gemini api key 1

AQ.Ab8RN6Ld9LhDPwWgedI9OAQxLP2wDA4gpG9koHHvII2H75As-Q



Gemini api key 2

AQ.Ab8RN6JZNE5aPjUl_awkGDRJRaS38xKUoIF2lD4wWcgml1YekQ



Gemini api key 3

AQ.Ab8RN6KlQCxRyPslxWkefaadNp9Ao0Fw7GytWkZrCJylzhHwXA



Gemini api key 4

AQ.Ab8RN6JW63Yzx0Pr-oUTMOJC-5ztgYbHka2GGdpgX6jja_d27Q



Gemini api key 5

AQ.Ab8RN6KOUDMHQ3UpBpt9IEN3oIYUr4gaqOwTGoec8NdK9Uqbnw

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c0a58c1e-9031-4a36-95ec-7f9016875e1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

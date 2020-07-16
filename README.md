### Concealed Information Test Mobile Application

### Summary

This app implements the response time Concealed Information Test (CIT) on smartphones. The CIT aims to reveal whether or not a certain information detail (e.g. a photo taken from the scene of a recent burglary) is known to the tested person.

### Installation and Requirements

Currently, the app is only built for _Android_ (i.e., smartphones with Andriod OS). It can be installed via Google Play freely (no fees, no ads): https://play.google.com/store/apps/details?id=io.gaspar.citapp

(Alternatively, the APK file is also directly available via https://osf.io/fjvna/, under the "CITapp" folder.)

It should run on any on any modern Android phone (4.4 [KitKat] or newer Andriod OS).

### Introduction

No deception detection method has been scientifically proven to achieve perfect or close to perfect accuracies in discriminating deceptive ("guilty") persons from truth-telling ("innocent") ones, notwithstanding the claims by some commercial services and products. The most efficient "Concealed Information Test" version in the present application ("enhanced") achieved a remarkably high accuracies (_Lukács, Kleinberg, & Verschuere, 2017_; _Lukács & Ansorge, 2019_), but even so it can only be said to provide an accuracy of roughly around 90% – under certain conditions – and it still needs further research and replications. Correspondingly, this application is only for testing and research purposes, and no serious judgments should be based on its results. Furthermore, anyone using it should have at least a basic understanding of how it works – see below.

### The CIT Versions

This application implements three versions of the reaction time-based Concealed Information Test (RT-CIT; _Seymour et al., 2000_; _Lukács, Kleinberg, & Verschuere, 2017_, _Lukács & Ansorge, 2019_): _standard_, _enhanced_, and _no-target_.

The _standard_ and _enhanced_ versions aim to reveal whether or not a certain information detail – the _probe_ – is known to the tested person. **In these cases, the identity of the probe should not be shown to the person taking the test: the starting page must be first completed and submitted by the person who administers the test. The**  **irrelevant**  **and**  **target** **items must be similar to the probe, and indistinguishable for a person who does not know the relevance of the probe (e.g. the probe is a stolen suitcase, and the irrelevant and targets are other suitcases).**

The _no-target_ version is a tentative approach to make the test applicable in cases where the _probe_ is actually known to the examinee. This version still needs a lot of research to see how and to what extent it may be applied. For details, see the paper by _Lukács & Ansorge (2019)_.

**Standard RT-CIT**: it has one probe, one target, and four irrelevant items. The target item will require a different response in the task, otherwise it is the same as an irrelevant item. A person who knows the relevance of the probe (e.g., because he stole the suitcase) will tend to make slower responses to it than to the irrelevant items.

In the standard RT-CIT, examinees classify the presented stimuli as the target or as one of several non-targets by pressing one of two keys. Five non-targets are presented, among which one is the probe, which is an item that only a guilty person would recognize, and the rest are irrelevants, which are similar to the probe and thus indistinguishable from it for an innocent person. For example, in a murder case where the true murder weapon was a knife, the probe could be the word "knife," while irrelevants could be "gun," "rope," etc. Assuming that the innocent examinees are not informed about how the murder was committed, they would not know which of the items is the probe. The items are repeatedly shown in a random sequence, and all of them have to be responded to with the same response keys, except one arbitrary target – a randomly selected, originally also irrelevant item that has to be responded to with the other response key. Since guilty examinees recognize the probe as the relevant item in respect of the deception detection scenario, it will become unique among the irrelevants and in this respect more similar to the rarely occurring target. Due to this conflict between instructed response classification of probes as irrelevants on the one hand, and probe's uniqueness and, thus, greater similarity to the alternative response classification as potential targets on the other hand, the response to the probe will be generally slower in comparison to the irrelevants, and thus, based on the probe-to-irrelevant RT differences, guilty examinees can be distinguished from innocent examinees.

**Enhanced RT-CIT**: in addition to the items in the standard RT-CIT, this has familiarity-related "filler" items that increase the awareness of the lie detection context, and thereby largely increase the probe-irrelevant difference (even slower responses to the probe).

These filler items induce a particular semantic context that increases the sensitivity of the method for the deception-related meaning of the probe. In the original study (_Lukács, Kleinberg, & Verschuere, 2017_), the probes were general autobiographical details (birthday, favorite color, etc.), and, correspondingly, the fillers were familiarity-related: fillers referring to the category familiar (e.g., "FAMILIAR," "MINE") had to be categorized with the same key as the target and, thus, with the opposite key than the probe (and the irrelevants), while fillers referring to the category unfamiliar (e.g., "OTHER," "THEIRS") had to be categorized with the same key as the probe (and irrelevants). It was assumed that in this way the fillers draw attention to the semantic meaning of the alternative response choices in view of the deception detection scenario (namely, that guilty examinees are denying their familiarity with the probe), thereby increasing the response conflict when the probe appears, making the response even slower. Moreover, the increased cognitive load (due to the increased complexity) also requires more attention throughout the task, which likely facilitates deeper processing of the stimuli. This method robustly increased the CIT accuracy of distinguishing guilty examinees from innocent ones.

**No-target RT-CIT**: the same as the enhanced RT-CIT, but with no target items. (For details, see Lukács & Ansorge, 2019.)

The CIT version version can be chosen under the SETTINGS tab, among various other options. 

### Item Selection and Image Items

The main items (probe, target, irrelevants) have to be given under the CORE tab, while fillers have to be given under the FILLERS tab.

#### "Irrelevants"

Importantly, the so-called "irrelevants" are not designated as such in the interface. Instead, there are five "probes": Probe 1, Probe 2, Probe 3, Probe 4, and Probe 5. The "real probe" (the item suspected to be recognized examinees) may be given as any of these potential probes (1-5). In the end the results will be evaluated in a way that each of the five potential probes are assessed separately as "real probe" versus the rest of the probes that are for this purpose designated as "irrelevants". The reason for this is that the single "real" probe is not always known in advance: for example, in case of an upcoming terrorist attack, a suspected terrorist may be shown several potential (suspected) locations for the attack, and the one item with the slowest responses may be designated as the "real probe" after the test is completed.

#### Images

Image items can be chosen for all item types. Any common image types are acceptable. (Note: Transparent parts will stay transparent in front of the general black background during the test.) 

Images may be preloaded in groups, and selected for the given places (e.g. as target or as a filler) afterwards. Any number of images may also be assigned automatically, using the "AUTOFILL ALL IMAGES" button, if the given images' filenames include designations of the given item types: "target", "probe1", "probe2", "probe3", "probe4", "probe5", "filler1", "filler2", "filler3", "filler4", "filler5", "filler6", "filler7", "filler8", "filler9". (So e.g., an image could be named "gun42_probe1.png", and it can then be autofilled for Probe 1.)

The displayed images will always have equal height and width. Therefore, to retain proper proportions, all images should be provided in a "square" format (i.e. with equal height and width). The size of the displayed image will be decided by the size of the device screen; namely, both height and width size will be equal to _the 62% of the screen height of the given device_. This assures that the image fits optimally above the response buttons in the test.

### Languages

Translations of the original English for all test instructions and filler items are currently available in German, Hungarian, and Polish. (Apart from the CIT texts from test start to test completion, the app interface language always stays English.) The translation process is [fairly straightforward](https://github.com/gasparl/citapp_mobile/blob/master/src/providers/translations/translations.ts); if you would like to contribute with an additional language, don't hesitate to [contact me](mailto:lkcsgaspar@gmail.com). (Japanese and Chinese translations are planned in the near future.)

To load the default fillers in any given language, press RESTORE DEFAULT under the FILLERS tab. General familiarity-related fillers in the given language will then be loaded.

### Consent for Data Sharing

To facilitate informed consent for data sharing, a special option is included to present the examinee with a brief "Data sharing consent form" within the test. (This is of course not needed if a separate consent form is used that includes data sharing statement.) The following options are available for selection "Yes", "No", "Yes but without items". All or any of these can be selected. If none of the options is selected (default), this entire form will be omitted, and after pressing START the first CIT instructions are presented. Otherwise "Yes" means that the examinee can opt to allow sharing (anonymously) all test data; "Yes but without items" means that the examinee can opt to allow sharing all test data except the items presented during the test (probe, target, irrelevants); "No" means that the examinee can opt to not allow sharing any data.

All related texts can be found in [this file](https://github.com/gasparl/citapp_mobile/blob/master/src/providers/translations/translations.ts) ("consent", "consentitems_chosen", "consentitems_conf").

### Task Structure

#### Number of Blocks

The number of blocks can be chosen (1, 2, 3, or 4). One block has the same length and arrangement as in recent studies (mainly _Lukács & Ansorge, 2019_). There is no data to show how many blocks per item categories (one probe with corresponding target and irrelevants) are optimal, but, as a rule of thumb, one block should already give a fair estimation, while more than two would probably not serve much additional information.

#### Trials

In each block of the standard and enhanced versions, each probe, irrelevant, and target is repeated 18 times (hence 18 probe, 72 irrelevant, and 18 target trials). In the no-target version, there is no target included (hence 18 probe and 72 irrelevant trials). The order of the items is randomized in groups: first, all five or six items (one probe, four irrelevant, and, where applicable, one target) in the given category are presented in a random order, then the same items are presented in another random order (but with the restriction that the first item in the next group is never the same as the last item in the previous group). In the enhanced and no-target version, fillers are placed among these items in a random order, but with the restrictions that an filler trial is never followed by another filler trial, and each of the nine fillers (three familiarity-referring, six unfamiliarity- referring) precedes the probe, the target (for enhanced, but not for no-target), and each of the four irrelevants exactly one time, in each block. (Thus 9 × 6 = 54 fillers are presented in the enhanced CIT, and 54 out of the 108 other items are preceded by an filler. Similarly, 9 × 5 = 45 fillers are presented in the enhanced CIT, and 45 out of the 90 other items are preceded by an filler.)

#### Practice Rounds

The main task is preceded by two or three practice rounds. If there are fillers (Enhanced and No-target versions), in the first round the examinee has to categorize all filler items once, and needs a minimum accuracy (ratio of correct responses in time per all responses) larger than 80% for each of the two filler types (i.e. left-side and right-side); otherwise the round has to be repeated. Next, there is a comprehension check (which is the first practice round for the Standard version). The check serves to ensure that the examinee fully understands the task. This phase includes all main items (probe, target, irrelevants) presented once. In this phase, examinees has plenty of time (10 s) to choose a response – however, each trial requires a correct response. In case of an incorrect response, the phase has to be repeated. In the following last practice task contains all possible items in the given test (main items and, where applicable, fillers). Here, 40% accuracy is needed on each item type, otherwise the round has to be repeated. The item types are: targets; left-side fillers; right-side fillers; main items (probes and irrelevants together).


### Settings Storage

For convenience, e.g. for an experiment, all settings (including texts, e.g. for core and filler items) can be stored in an online database and then loaded in the app on anyone's device. Storage can be done in two ways.

First, via the following website: https://gasparl.github.io/citapp_storage/. The form simply needs to be filled according with the desired settings.

Second, within the app under SETTINGS, with the SAVE SETTINGS ONLINE button, in which case the app's current settings will be stored.

In either case, an _Identifier_ and a _Password_ must be given. These should contain only simple English characters and underscores (and @ and dot in case of _Identifier_, for emails). There are no length requirements, in fact both fields may be left empty – but this (or similarly simple choices) would make the storage highly unreliable, since anyone might override it. Therefore, at least an _Identifier_ of some length should be given, ideally an email address: this ensures uniqueness as well as allows to send password reminders if needed.

As soon as the settings are stored, they can be autofilled using the LOAD SETTINGS (under SETTINGS menu) using the given _Identifier_ and _Password_.


### Results


At the end of the test there are no instructions or button, but only the text "_Test completed._" (in the selected language). This is to prevent subjects to see the results without permission. To see the results, _swipe right_ on the text. The summary results will then be available including detailed description of each variable and potential interpretation. The full results file (with each response recorded) is saved on the phone: the path to the file is displayed below the summary, and the full file may forwarded using any application on the device. (Alternatively, the data can also be copied to the clipboard as plain text.) The summaries of all completed tests will be permanently available (unless explicitely removed/deleted) in a list under the RESULTS menu in the application.


The data contains all responses (one per row) from the test, with all relevant information, corresponding to the self-explanatory titles in the first row.

_**subject\_id**: The subject identification text as given on the starting page._

_**cit\_version**: The CIT version as selected on the starting page._

_**block\_number**: The number of the block._

_**trial\_number**: The number of the trial._

_**stimulus\_shown**: The specific text of the stimulus that was displayed on the screen._

_**category**: Either "main\_item" (probe, irrelevant, or target), or "filler" (familiar-referring or unfamiliar-referring)._

_**stim\_type**: More specific type: probe, irrelevant, target, familiar-referring filler, or unfamiliar-referring filler._

_**response\_key**: The response key that was used ("e" or "i"), regardless whether it was correct or not._

_**rt_start**: The keypress time (from the start of the presentation of the stimulus until the pressing of the response key – conventional response time); in ms._

_**rt_end**: The "keyup" time (from the start of the presentation of the stimulus until the releasing of the response key); in ms._

_**incorrect**: Whether the response was correct: 1 for incorrect, 0 for correct._

_**too\_slow**: Whether the response was too slow: 1 for too slow, 0 for not too slow._

_**date\_in\_ms**: The number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC. (This documents the exact time and duration of the experiment, allows to calculate the length of pauses taken between the blocks, etc.)_


### Example usage

To experimentally test this application, one may for example enter the personal name (e.g., forename) of a examinee as probe, and other, similar names as target and irrelevant items. (These latter items should be controlled for similarity to the extent possible; e.g., number of characters or syllables, word frequency, etc.) In this case, the examinee's responses to the probe (own personal name) should be notably slower than the responses to the irrelevants (e.g., around 15-30 ms average difference). Correspondingly, the _d-CIT_ should be relatively high as well (e.g., larger than 0.3). As a control condition, one may enter irrelevant names for all item types, so that the probe, irrelevant, and target items are all in fact irrelevant to the examinee. In this case, the responses to the probe should be of similar speed as the responses to the irrelevants (since, again, the probe is not relevant to the examinee and is not recognized as any different from the rest of the items).

For convenience, there is a _Demo_ menu, under which the start page may be automatically filled by a simple button press. (The description of the example is given under the same menu.)

### Terms of Use and Privacy

This application as well as its source code is free to use and to redistribute, as per the [BSD-2-Clause License](https://github.com/gasparl/citapp_mobile/blob/master/LICENSE "BSD-2-Clause").

By using this application, you agree to the anonymous and automatic sharing of some very basic data as follows. After each completed test, the application will automatically attempt to forward the following three details to be saved in a private database for statistical purposes: (a) the date (year, month, day) when the test was completed, (b) the language in which the test was completed, (c) the country code for the approximate location of the testing (based on IP address – but the IP address itself is not saved). Of course, if the application is always used offline, this data will never be forwarded.

### Support

If you have any questions or find any issues (bugs, desired features), [write an email](mailto:lkcsgaspar@gmail.com) or [open a new issue](https://github.com/gasparl/citapp_mobile/issues "Issues").

### Citation

Cite this application as:

Lukács, G., Kleinberg, B., Kunzi, M., & Ansorge, U. (2020). Response Time Concealed Information Test on Smartphones. _Collabra: Psychology, 6_(1), 4. http://doi.org/10.1525/collabra.255

### References

Lukács, G. & Ansorge, U. (2019). Information leakage in the response time-based Concealed Information Test. _Applied Cognitive Psychology_. https://doi.org/10.1002/acp.3565

Lukács, G., Kleinberg, B., & Verschuere, B. (2017). Familiarity-related fillers improve the validity of reaction time-based memory detection. _Journal of Applied Research in Memory and Cognition, 6_(3), 295–305. https://doi.org/10.1016/j.jarmac.2017.01.013

Noordraven, E., & Verschuere, B. (2013). Predicting the sensitivity of the reaction time-based Concealed Information Test: Detecting deception with the Concealed Information Test. _Applied Cognitive Psychology, 27_(3), 328–335. https://doi.org/10.1002/acp.2910

Seymour, T. L., Seifert, C. M., Shafto, M. G., & Mosmann, A. L. (2000). Using response time measures to assess "guilty knowledge". _Journal of Applied Psychology, 85_(1), 30–37. https://doi.org/10.1037//0021-9010.85.1.30

[![DOI](https://zenodo.org/badge/219313499.svg)](https://zenodo.org/badge/latestdoi/219313499)


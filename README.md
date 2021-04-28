# New Leaf - *Discord Moderation Tool*
New Leaf allows Discord guild administrators to automatically scan a text channel and delete messages containing profanity with minimal human intervention.

---

## Usage
Commands are issued to the bot by sending messages to a text channel.

A standard clean command will target [a precompiled list of profane words](https://github.com/web-mech/badwords/blob/master/lib/lang.json):
> !clean

*or*

Target only specific words for deletion:
> !clean apple banana orange

Stop a cleaning:
> !stop

See how many messages have been checked for profanity:
> !progress

---

## Options
By default, the bot won't delete messages containing profane language that appears in code blocks, links, or quotations.

The default behavior can be changed with optional arguments:
> !clean --blocks --links --quotes apple banana orange

or, for short:
> !clean -blq apple banana orange

---

## Extras
Everyone needs a coin to flip!
> !coinflip

---

## Limitations
Due to rate limits on the official Discord API, each guild is limited to a single execution of the clean operation at a time. Additionally, the same rate limits cause each clean operation to take a significant amount of time, increasing with the number of messages in the text channel being scanned. For example, a test run on a text channel with ~180,000 messages took 40 minutes to complete.

---

## Development Releases
- [x] v0.1: Simple clean routine
- [x] v0.2: User authorization
- [x] ~~v0.3: Bulk deletion~~: **Messages older than two weeks can't be bulk deleted due to the nature of the official Discord API**
- [x] v0.4: Refactor: **First implementation using async**
- [x] v0.5: Command dispatch: **Allows support of multiple commands**
- [x] v0.6: Testing backlog
- [x] v0.7: Command options


# New Leaf - *Discord Moderation Tool*
Simply, the purpose of New Leaf bot is to allow Discord guild administrators to automatically scan a text channel and delete any discovered profanity with minimal action needed by the administrators.

## Usage
Once added to a server, administrators can issue commands to the bot via messages to a text channel:
> !clean

Specific words can be targeted to flag messages for deletion:
> !clean -w apple,banana,orange

The progress of a clean operation can be checked with a message to a text channel where a clean operation is in progress:
> !progress

*Note: There is currently no way to represent progress as a precentage.*

## Limitations
Due to rate limits on the official Discord API, each guild is limited to a single execution of the clean operation at a time. Additionally, the same rate limits cause each clean operation to take a significant amount of time, increasing with the number of messages in the text channel being scanned. For example, a test run on a text channel with ~180,000 messages took 40 minutes to complete.

## Dev Releases
- [x] v0.1: Simple clean routine
- [x] v0.2: User authorization
- [x] ~~v0.3: Bulk deletion~~: **Messages older than two weeks can't be deleted due to the nature of the official Discord API**
- [x] v0.4: Refactor: **First implementation using async**
- [x] v0.5: Command dispatch: **Allows support of multiple commands**
- [ ] v0.6: Unit testing
- [ ] v0.7: Command options

    ...More to come...

## Extras
Everyone needs a coin to flip!
> !coinflip
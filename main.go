package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    _ "github.com/joho/godotenv/autoload"
    "github.com/bwmarrin/discordgo"
)

func main() {
    // Read secret from env file
    token := os.Getenv("DISCORD_TOKEN")

    // Start a discord session
    session, err := discordgo.New("Bot " + token)
    if err != nil {
        fmt.Println("error creating session: ", err)
        return
    }

    // Add event handlers
    session.AddHandler(messageCreate)

    // Open a session
    err = session.Open()
    if err != nil {
        fmt.Println("error opening connection: ", err)
        return
    }
    defer session.Close()

    // Listen for termination signals
    signalChannel := make(chan os.Signal, 1)
    signal.Notify(signalChannel, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
    <-signalChannel
}

func messageCreate(s *discordgo.Session, m *discordgo.MessageCreate) {
    // Ignore messages from the bot
	if m.Author.ID == s.State.User.ID {
		return
	}

    //Trigger work
    fmt.Println("hello")!
    /*
    if not authorize()
        return unauthorized
    if not validate()
        return invalid
    if not cache()
        return already running
    defer uncache()
    clean()
    */
}


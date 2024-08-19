'use client'

import { useUser } from '@clerk/nextjs'
import { Box, Container, Paper, DialogActions, DialogContentText, DialogContent, TextField, Typography, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle } from '@mui/material'
import { collection, writeBatch, setDoc, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { db } from '@/firebase'

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        document.querySelector("#loader-parent").style.display = "flex"
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
            .then(() => document.querySelector("#loader-parent").style.display = "none")
            .then(() => {
                window.dispatchEvent(new Event('resize'))
                let elements = document.querySelectorAll(".MuiGrid-root")
                Array.from(elements).forEach(el => {
                    let dv = el.style.display
                    el.style.display = "none"
                    el.offsetHeight
                    el.style.display = dv
                })
            })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleEnter = (ev) => {
        if (ev.key == "Enter") {
            ev.preventDefault()
            handleSubmit()
        }
    }

    const saveFlashcard = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            } else {
                collections.push({ name })
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (<Container maxWidth="md">
        <Box sx={{
            mt: 4,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
        >
            <Typography fontFamily="Plantagenet Cherokee" variant="h4" id="generate-flashcards">Generate Flashcards</Typography>
            <Paper sx={{ p: 4, width: '100%' }}>
                <TextField
                    fontFamily="Big Caslon"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { handleEnter(e) }}
                    label="Enter text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        mb: 2,
                    }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    fullWidth
                    fontFamily="Big Caslon"
                >Submit
                </Button>
            </Paper>
        </Box>
        <div id="loader-parent"><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>

        {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography textAlign="center" fontFamily="Plantagenet Cherokee" variant="h5">Flashcards Preview</Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => {
                                    handleCardClick(index)
                                }}
                                >
                                    <CardContent sx={{ '&': { background: 'ghostwhite' } }}>
                                        <Box
                                            sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    background: 'rgb(156, 39, 176)',
                                                    color: 'white',
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '250px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[index]
                                                        ? 'rotateY(180deg)'
                                                        : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography lineHeight="0.9" fontFamily="Big Caslon" variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography lineHeight="0.9" fontFamily="Big Caslon" variant="h6" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button fontFamily="Big Caslon" variant='contained' color='secondary' onClick={handleOpen}>
                        Save
                    </Button>
                </Box>
            </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle fontFamily="Big Caslon">Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText fontFamily="Big Caslon">
                    Please enter a name for your flashcards collection
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Collection Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button fontFamily="Big Caslon" onClick={handleClose}>Cancel</Button>
                <Button fontFamily="Big Caslon" onClick={saveFlashcard}>Save</Button>
            </DialogActions>
        </Dialog>
    </Container>
    )
}
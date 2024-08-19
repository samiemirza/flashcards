'use client'
import Image from 'next/image'
import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSubmitPro = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://flashcards-phi-eight.vercel.app/',
        plan: "pro",
      },
      
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }


  const handleSubmitBasic = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000',
        plan: "basic",
      },
      
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }


  const getStarted = async () => {
    router.push('/generate')
  }

  return (
    <Container maxWidth="100vw" id="home-root">
      <Head>
        <title fontFamily="Plantagenet Cherokee">Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <AppBar color="secondary" position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button fontFamily="Big Caslon" color="inherit" href="/sign-in">
              {''}
              Log In
            </Button>
            <Button fontFamily="Big Caslon" color="inherit" href="sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: 'center',
          my: 4,
        }}
      >
        <Typography fontFamily="Big Caslon" variant="h2" gutterBottom>Welcome to Flashcard SaaS!</Typography>
        <Typography fontFamily="Big Caslon" variant="h5" gutterBottom>
          {''}
          The easiest way to make flashcards from your text!
        </Typography>
        <Button fontFamily="Big Caslon" onClick={getStarted} variant="contained" color="secondary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography fontFamily="Plantagenet Cherokee" textAlign="center" variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography fontFamily="Plantagenet Cherokee" variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography fontFamily="Big Caslon">
              {''}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography fontFamily="Plantagenet Cherokee" variant="h6" gutterBottom>Smart Flashcards</Typography>
            <Typography fontFamily="Big Caslon">
              {''}
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography fontFamily="Plantagenet Cherokee" variant="h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography fontFamily="Big Caslon">
              {''}
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography fontFamily="Plantagenet Cherokee" variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '5px ridge',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
            >
              <Typography fontFamily="Plantagenet Cherokee" variant="h5" gutterBottom>Basic</Typography>
              <Typography fontFamily="Plantagenet Cherokee" variant="h6" gutterBottom>$5 / month</Typography>
              <Typography fontFamily="Big Caslon">
                {''}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button fontFamily="Big Caslon" variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSubmitBasic}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: '5px ridge',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
            >
              <Typography fontFamily="Plantagenet Cherokee" variant="h5" gutterBottom>Pro</Typography>
              <Typography fontFamily="Plantagenet Cherokee" variant="h6" gutterBottom>$10 / month</Typography>
              <Typography fontFamily="Big Caslon">
                {''}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button fontFamily="Big Caslon" variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleSubmitPro}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

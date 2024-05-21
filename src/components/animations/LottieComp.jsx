import Lottie from "lottie-react"

export const LottieComp = ({animation, ...props}) => {
    return <Lottie animationData={animation} {...props} />
}
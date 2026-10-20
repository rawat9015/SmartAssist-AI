// Wrap async route handlers to automatically catch errors and pass them to Express's global error middleware.

const asyncHandler = (fn) => {
     return (req,res,next) =>{
        Promise.resolve(fn(req,res,next)).catch(next);
     }
}

export default asyncHandler;
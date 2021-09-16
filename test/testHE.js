// Homomorphic Encryption Test Example
const ChainsqlAPI = require('../src/index');
main()


async function  main(){

    const c = new ChainsqlAPI();
    try{

        var encyptParms = {
            schemeType : 'ckks',
            polyModulusDegree : 2048
        }
        var heKeypair = await c.genHomEncryptKeypair(encyptParms)

        var encyptParams = {
            homEncryptParams:heKeypair.homEncryptParams,
            homPublicKey:heKeypair.homPublicKey,
            homPlainValue:'121.00001'
        }
        var encryptCipher = await c.homEncrypt(encyptParams)

        var decryptParams = {
            homEncryptParams:heKeypair.homEncryptParams,
            homPrivateKey:heKeypair.homPrivateKey,
            homCipherText:encryptCipher
        }
        var plainValue = await c.homDecrypt(decryptParams)

        console.log(plainValue)


        encyptParms.schemeType = 'bfv'
        heKeypair = await c.genHomEncryptKeypair(encyptParms)
        //console.log('bfv',JSON.stringify(heKeypair) )     
        
        
        var encyptParams = {
            homEncryptParams:heKeypair.homEncryptParams,
            homPublicKey:heKeypair.homPublicKey,
            homPlainValue:'120'
        }
        encryptCipher = await c.homEncrypt(encyptParams)

        decryptParams = {
            homEncryptParams:heKeypair.homEncryptParams,
            homPrivateKey:heKeypair.homPrivateKey,
            homCipherText:encryptCipher
        }
        plainValue = await c.homDecrypt(decryptParams)

        console.log(plainValue)
    }catch(err){
        console.error(err)
    }
}